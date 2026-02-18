import { NextRequest, NextResponse } from 'next/server';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

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
            return new NextResponse(JSON.stringify({}), { status: 404 });
        }

        return new NextResponse(res.Body as ReadableStream, {
            status: 200,
            headers: {
                'Content-Type': 'application/octet-stream'
            }
        });

    } catch {
        if (process.env.STRICT == "true")
        {
            return new NextResponse('Package not found', { status: 404 })
        }
        
        try {
            const upstream = await fetch(
                `https://registry.npmjs.org/${packagename}/-/${tarballfile}`
            );

            
            return new NextResponse(upstream.body, {
                status: upstream.status,
                headers: upstream.headers
            });
            
        }catch {
            return new NextResponse(JSON.stringify({"Error": 'Package not found'}), { status: 404 })
        }
    }

}

    
