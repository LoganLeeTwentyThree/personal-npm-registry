const { MongoClient } = require('mongodb');
import { PackageVersionObject } from '@/types';
import { DeleteObjectCommand, DeleteObjectsCommand, S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv'
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';



export async function DELETE(
    request: NextRequest,
        { params }: { params: Promise<{ packagename: string, packageversion: string, revision : string }> },
    ) {
    const name = (await params).packagename;
    const revision = (await params).revision;

    dotenv.config({ path: '../../../.env.local' })
    const uri = process.env.DATABASE_STRING;

    const client = new MongoClient(uri);

    //TODO: Authorization
    try {
        const database = client.db('private-npm');
        const roots = database.collection('package-roots');
        const versions = database.collection('package-version-objs');

        const obj = await roots.findOne({ _id: new ObjectId(revision) })

        if( obj != null)
        {
            await roots.deleteOne({ _id: new ObjectId(revision) })
            await versions.deleteMany({ name: obj.name })

            const filenames = Object.keys(obj.versions).map((e) => ({ Key: `${name}-${e}.tgz`}) )
            console.log(filenames)
            
            const bucketName = process.env.S3_BUCKET
            const s3_client = new S3Client({ });
            const command = new DeleteObjectsCommand({
                Bucket: bucketName,
                Delete: {
                    Objects: filenames,
                },
            }); 

            await s3_client.send(command)

            return new NextResponse(null, {
                status: 200,
                headers: { }
            ,})
        }else
        {
            return new NextResponse(JSON.stringify( {error: "Package not found"} ), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            ,})
        }
    } catch (caught){
        console.log(caught)

        return new NextResponse(JSON.stringify( {error: "Database Error"} ), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        ,})
    }finally {
        await client.close();
    }

    
}