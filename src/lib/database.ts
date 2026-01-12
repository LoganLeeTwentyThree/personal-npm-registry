const crypto = require('crypto');
const { MongoClient } = require('mongodb');
import { User } from '@auth0/nextjs-auth0/types';
import dotenv from 'dotenv'
import { PackageRoot,PackageVersionObject } from '@/types';

//get database token
export function generateTokenFromUUID(uuid : string | undefined)
{
    if (uuid == undefined)
    {
        return "invalid uuid"
    }
    const hash = crypto.createHash('sha256')
    hash.update(uuid)
    const digest = hash.digest('hex')
    return digest
}

//retrieve a user by its database token
export async function getUserByToken( token : string | undefined ) 
{
    if( token == undefined )
    {
        return null
    }

    dotenv.config({ path: '../.env.local' })
    const uri = process.env.DATABASE_STRING;
    const client = new MongoClient(uri);
    try {
        const database = client.db('private-npm');

        //check if user is in db 
        const user = await database.collection('npm-tokens').findOne({token: token})

        return user
    }finally {
      await client.close();
    }
}

export async function insertUser( uuid : string | undefined, name : string | undefined, user : User )
{
    dotenv.config({ path: '../.env.local' })
    const uri = process.env.DATABASE_STRING;
    const client = new MongoClient(uri);
    const database = client.db('private-npm');

    const token = generateTokenFromUUID(uuid)
    const dbuser = await getUserByToken(token)

    if ( dbuser == null && token != "invalid uuid") //no duplicate users
    {
        
        try {
            await database.collection('npm-tokens').insertOne(
            {
                token: token,
                uuid: user.sub, 
                name: name, 
                createdAt: new Date()
            })
        }finally 
        {
            await client.close();
        }
        
    }
}

export async function insertPackageMetaData( packageRoot : PackageRoot, versionObj : PackageVersionObject )
{
    dotenv.config({ path: '../.env.local' })
    const uri = process.env.DATABASE_STRING;
    const client = new MongoClient(uri);

    try {
        const database = client.db('private-npm');

        //check if package is in db 
        const root : PackageRoot | null = await database.collection('package-roots').findOne({name: packageRoot.name})

        if (root == null) //new package
        {
            

            await database.collection('package-roots').insertOne(packageRoot)

        }else //existing package
        {
            await database.collection('package-roots').update({name:packageRoot.name}, {$set : { versions: versionObj }})
        }

        await database.collection('package-version-objs').insertOne(versionObj)
        

        
        
    }finally {
      await client.close();
    }
}