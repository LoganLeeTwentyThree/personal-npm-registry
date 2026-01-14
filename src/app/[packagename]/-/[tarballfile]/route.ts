import { NextRequest } from 'next/server';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv'

export async function GET(
  _request: NextRequest,
  { params }: {  params : Promise<{packagename: string; tarballfile: string }>}
) {
    const { packagename, tarballfile } = await params;

    try {
        const s3 = new S3Client({});
        const res = await s3.send(
            new GetObjectCommand({
                Bucket: process.env.S3_BUCKET!,
                Key: tarballfile
            })
        );

        if (!res.Body) {
            return new Response(null, { status: 404 });
        }

        return new Response(res.Body as ReadableStream, {
            status: 200,
            headers: {
                'Content-Type': 'application/octet-stream'
            }
        });

    } catch {
        dotenv.config({path: '/../../../../../.env.local'})
        if (process.env.STRICT == "true")
        {
            return new Response('Package not found', { status: 404 })
        }
        
        try {
            const upstream = await fetch(
                `https://registry.npmjs.org/${packagename}/-/${tarballfile}`
            );

            
            return new Response(upstream.body, {
                status: upstream.status,
                headers: {
                    'Content-Type': 'application/octet-stream'
                }
            });
            
        }catch {
            return new Response('Package not found', { status: 404 })
        }
    }

}

    
