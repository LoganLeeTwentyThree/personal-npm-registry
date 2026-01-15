const { MongoClient } = require('mongodb');
import dotenv from 'dotenv'
import { NextRequest, NextResponse } from 'next/server';
import { PackageRoot, PackageVersionObject } from '@/types';
import { headers } from 'next/headers';
import { generateTokenFromUUID, getUserByToken, insertPackageMetaData } from '@/lib/database';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
const crypto = require('crypto');

export async function PUT(
    request: NextRequest,
        { params }: { params: Promise<{ packagename: string }> },
    )
{
    const packageName = (await params).packagename
    const headersList = await headers()

    const bearer = headersList.get('authorization')
    const uuid = bearer?.split(" ")[1]

    const token = await generateTokenFromUUID(uuid)
    const validToken = await getUserByToken(token)

    //valid request
    //TODO: contributor authorization
    if( validToken != undefined && validToken != null)
    {
        dotenv.config({ path: '../../.env.local' })

        const body = await request.json(); 

        //check integrity
        const [filename, attachment] = Object.entries(body._attachments)[0] as [
            string,
            { content_type: string, data: string }
        ];
        const tarball = Buffer.from(attachment.data, 'base64');

        const actual = crypto
        .createHash('sha1')
        .update(tarball)
        .digest('hex');

        if (actual !== body.versions[Object.keys(body.versions).at(-1)!].dist.shasum) {
            throw new Error('Tarball integrity check failed');
        }

        //upload to s3 here
        const bucketName = process.env.S3_BUCKET
        const s3_client = new S3Client({ });
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: filename,
            Body: tarball,
        });        
        
        let response = await s3_client.send(command)

        const packageRoot : PackageRoot = {
            name: body.name, 
            versions: body.versions,
        }

        const newVersionObj : PackageVersionObject = {
            name : body.name,
            version: body.versions[Object.keys(body.versions).at(-1)!].version,
            dist: body.versions[Object.keys(body.versions).at(-1)!].dist
        }

        //upload metadata to mongo here
        await insertPackageMetaData(packageRoot, newVersionObj)
        
        return new NextResponse(JSON.stringify( {ok: true} ), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        ,})

    }else
    {
        return new NextResponse(JSON.stringify( {error: "Unauthorized"} ), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        ,})
    }
}

export async function GET(
    request: NextRequest,
        { params }: { params: Promise<{ packagename: string }> },
    ) {
    const name = (await params).packagename;
    

    dotenv.config({ path: '../../.env.local' })
    const uri = process.env.DATABASE_STRING;

    const client = new MongoClient(uri);
    

    try {
        const database = client.db('private-npm');
        const test = database.collection('package-roots');

        const response = await test.findOne({name: name});


        if (response != null)
        {
            return new NextResponse(JSON.stringify( {_rev : response._id, ...response } ), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
                }
            )
        }else
        {
            
            if(request.headers.get('npm-command') != 'publish' && process.env.STRICT == "false")
            {
                //go get package from npm registry...
                let otherResponse = await fetch("https://registry.npmjs.org/" + name)

                return new NextResponse(otherResponse.body, {
                    status: otherResponse.status,
                    headers: {
                    'Content-type': 'application/json'
                    }
                })
            }else
            {
                return new NextResponse(JSON.stringify( {"Error": "Not Found"} ), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                    }
                )
            }
            
            
        }
         
    } catch {
        return new NextResponse(JSON.stringify( {error: "Database Error"} ), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }finally {
        await client.close();
    }

    
}