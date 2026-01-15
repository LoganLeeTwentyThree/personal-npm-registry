const { MongoClient } = require('mongodb');
import dotenv from 'dotenv'
import { NextRequest, NextResponse } from 'next/server';
import { PackageRoot, PackageVersionObject } from '@/types';
import { headers } from 'next/headers';
import { generateTokenFromUUID, getPackageRoot, getUserByToken, insertPackageMetaData } from '@/lib/database';
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
    const user = await getUserByToken(token)

    //valid request
    if( user != undefined && user != null)
    {
        dotenv.config({ path: '../../.env.local' })

        const body = await request.json(); 

        if( headersList.get('npm-command') == 'publish')
        {
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
            
            await s3_client.send(command)
        }
        

        const exists = await (await getPackageRoot(body.name, headersList.get('npm-command')!)).json()
       
        if (exists.ok && !exists.maintainers.includes(token))//check authorization
        {
            return new NextResponse(JSON.stringify( {"Error" : "Not Authorized"} ), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        const { _attachments, access, ...packageRootBody} = body
        //upload metadata to mongo here
        await insertPackageMetaData(packageRootBody, token)
        
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
    const name = (await params).packagename
    const headersList = await headers()

    return getPackageRoot(name, headersList.get('npm-command')!)

    
}