const crypto = require('crypto');
const { MongoClient } = require('mongodb');
import { PackageRoot, User } from '@/types';
import { DeleteObjectCommand, DeleteObjectsCommand, S3Client } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function getPackageRoot(name : string, command : string) : Promise<PackageRoot | null>
{
    const uri = process.env.DATABASE_STRING

    const client = new MongoClient(uri)

    try {
        const database = client.db('private-npm');
        const test = database.collection('package-roots');

        const response = await test.findOne({name: name});


        if (response != null)
        {
            const { maintainers, _id, ...filteredResponse } = response;
            return { _id: name, ...filteredResponse } 
        }else
        {
            
            if(command != 'publish' && process.env.STRICT == "false")
            {
                //go get package from npm registry...
                let otherResponse = await fetch("https://registry.npmjs.org/" + name)

                return otherResponse.json()
            }else
            {
                return null
            }
            
            
        }
         
    }finally {
        await client.close();
    }
}

//hash a string
export function hash(str : string) : string
{
    const hash = crypto.createHash('sha256')
    hash.update(str)
    const digest : string = hash.digest('hex')
    return digest
}

//retrieve a user by its hashed npm token
export async function getUserByToken( token : string ) : Promise<User | null>
{
    const uri = process.env.DATABASE_STRING;
    const client = new MongoClient(uri);
    try {
        const database = client.db('private-npm');

        //check if user is in db 
        const user = await database.collection('users').findOne({token: token})

        return user
    }finally {
      await client.close();
    }
}

export async function getUserByCredentials( email : string, password : string) : Promise<User | null>
{
    const uri = process.env.DATABASE_STRING;
    const client = new MongoClient(uri);
    const database = client.db('private-npm');
    const users = database.collection('users')

    const hashpw = hash(password)
    
    let result : User | null = users.findOne({ email: email, password: hashpw})
    return result
}


export async function insertUser( token : string, email : string, password : string )
{
    const uri = process.env.DATABASE_STRING;
    const client = new MongoClient(uri);
    const database = client.db('private-npm');

    const hashtoken : string = hash(token)
    const dbuser = await getUserByToken(token)

    const pwhash : string = hash(password)
    if ( !dbuser && token != "invalid uuid") //no duplicate users
    {
        
        try {
            const newUser : User = {
                token: hashtoken,
                email: email, 
                password: pwhash,
                createdAt: new Date()
            } 

            await database.collection('users').insertOne(newUser)
        }finally 
        {
            await client.close();
        }
        
    }
}

export async function setPendingToComplete( uuid: string )
{
    const uri = process.env.DATABASE_STRING;
    const client = new MongoClient(uri);
    const database = client.db('private-npm');
    const tempUUIDS = database.collection('temp-uuids')

    console.log(uuid)
        
    try {
        await tempUUIDS.updateOne(
        {
            token: uuid
        },
        {
            $set: {status: "complete"}
        })
    }finally 
    {
        await client.close();
    }
        
    
}

export async function insertPackageMetaData( packageRoot : PackageRoot, token : string )
{
    const uri = process.env.DATABASE_STRING;
    const client = new MongoClient(uri);

    try {
        const database = client.db('private-npm');

        //check if package is in db 
        const root : PackageRoot | null = await database.collection('package-roots').findOne({name: packageRoot.name})

        if (root == null) //new package
        {
            await database.collection('package-roots').insertOne({maintainers : [token], _rev: `1-${new ObjectId()}`, ...packageRoot})

        }else //existing package
        {
            const newVersionNumbers = Object.keys(packageRoot.versions)
            let newVersions = {...packageRoot.versions}            

            //get existing versions that aren't being updated
            for (const oldVersion of Object.keys(root.versions))
            {
                if(!newVersionNumbers.includes(oldVersion))
                {
                    newVersions = {[oldVersion] : root.versions[oldVersion], ...newVersions}
                }
            }


            await database.collection('package-roots').updateOne({name: packageRoot.name}, { $set : { versions: newVersions}})
        }
        
    }finally {
      await client.close();
    }
}


export async function deletePackageMetaData(name : string, token : string)
{
    const uri = process.env.DATABASE_STRING;

    const client = new MongoClient(uri);

   
    try {
        const database = client.db('private-npm');
        const roots = database.collection('package-roots');

        const obj = await roots.findOne({ _id: name })

        if( obj == null )
        {
            return new NextResponse(JSON.stringify( {error: "Package not found"} ), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            })
        }
    
        if(!obj.maintainers.includes(token))
        {
                return new NextResponse(JSON.stringify( {error: "Unauthorized"} ), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        await roots.deleteOne({ _id: name })

        const filenames = Object.keys(obj.versions).map((e) => ({ Key: `${obj.name}-${e}.tgz`}) )
        
        const bucketName = process.env.S3_BUCKET
        const s3_client = new S3Client({ });
        const command = new DeleteObjectsCommand({
            Bucket: bucketName,
            Delete: {
                Objects: filenames,
            },
        }); 

        await s3_client.send(command)

        return new NextResponse(JSON.stringify( {result: "Success"} ), {
            status: 200,
            headers: {'Content-Type': 'application/json'}
        })
    
    
            
        
    } catch (caught){
        console.log(caught)

        return new NextResponse(JSON.stringify( {error: "Database Error"} ), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }finally {
        await client.close();
    }
}

export async function modifyPackage(newRoot : PackageRoot, token : string)
{
    const uri = process.env.DATABASE_STRING;

    const client = new MongoClient(uri);

   
    try {
        const database = client.db('private-npm');
        const roots = database.collection('package-roots');

        const obj = await roots.findOne({ _id: newRoot.name })

        if( obj == null )
        {
            return new NextResponse(JSON.stringify( {error: "Package not found"} ), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            })
        }
    
        if(!obj.maintainers.includes(token))
        {
            return new NextResponse(JSON.stringify( {error: "Unauthorized"} ), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        await roots.replaceOne({_id: newRoot.name}, {maintainers: obj.maintainers, ...newRoot})

        return new NextResponse(JSON.stringify( {result: "Success"} ), {
            status: 200,
            headers: {'Content-Type': 'application/json'}
        })
        
    }finally
    {
        await client.close()
    }
}

export async function deletePackageTarball(filename : string, token : string)
{
    const uri = process.env.DATABASE_STRING;

    const client = new MongoClient(uri);
    const database = client.db('private-npm');
    const roots = database.collection('package-roots');
    const obj = await roots.findOne({ name: filename.substring(0, filename.lastIndexOf('-')).trim() })

    if( obj == null )
    {
        return new NextResponse(JSON.stringify( {error: "Package not found"} ), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
        })
    }

    if(!obj.maintainers.includes(token))
    {
        console.log(obj.maintainers)
        return new NextResponse(JSON.stringify( {error: "Unauthorized"} ), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        })
    }

    
    const bucketName = process.env.S3_BUCKET
    const s3_client = new S3Client({ });
    const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: filename,
    });        
            
    try {
        await s3_client.send(command)

        return new NextResponse(JSON.stringify( {result: "Success"} ), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })
    }catch
    {
        return new NextResponse(JSON.stringify( {result: "Error"} ), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
    
}