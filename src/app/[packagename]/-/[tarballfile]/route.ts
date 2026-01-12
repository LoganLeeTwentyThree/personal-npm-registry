import dotenv from 'dotenv'
import { NextRequest } from 'next/server';
import { GetObjectCommand, NoSuchKey, S3Client } from '@aws-sdk/client-s3';

export async function GET(
    request: NextRequest,
        { params }: { params: Promise<{ packagename : string , tarballfile: string }> },
    ) {
    const filename = (await params).tarballfile;
    const packagename = (await params).packagename;

    dotenv.config({ path: '../../.env.local' })
    

    try {

        const bucketName = process.env.S3_BUCKET
        const s3_client = new S3Client({ });
        const response = await s3_client.send(
            new GetObjectCommand({
                Bucket: bucketName,
                Key: filename,
            }),
        );
        
        let tarball = response.Body?.transformToString()
        
        return new Response(JSON.stringify( tarball )), {
            status: 200,
            headers: { 'Content-Type': 'application/octet-stream' }
        ,}
         
    } catch (caught){
        if (caught instanceof NoSuchKey) {
            let otherResponse = await fetch("https://registry.npmjs.org/" + packagename + "/-/" + filename)
        
            return new Response(otherResponse.body, {
                status: otherResponse.status,
                headers: {
                'content-type': 'application/json'
                }
            });
        }   
        
    }

    return new Response(JSON.stringify( {} )), {
        status: 404,
        headers: {  }
    ,}

    
}