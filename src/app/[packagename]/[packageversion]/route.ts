const { MongoClient } = require('mongodb');
import dotenv from 'dotenv'
import { Timestamp } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { PackageVersionObject } from '@/types';



export async function GET(
    request: NextRequest,
        { params }: { params: Promise<{ packagename: string, packageversion: string }> },
    ) {
    const name = (await params).packagename;
    const version = (await params).packageversion;

    dotenv.config({ path: '../../.env.local' })
    const uri = process.env.DATABASE_STRING;

    const client = new MongoClient(uri);
    

    try {
        const database = client.db('private-npm');
        const test = database.collection('package-version-objs');

        const response : PackageVersionObject = await test.findOne({name: name, version: version});

        if (response != null)
        {
            return new NextResponse(JSON.stringify( response ), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
                ,}
            )
        }else
        {
            return new NextResponse(JSON.stringify( {error: "Not found", reason: "Package with name '" + name + "' and version '" + version + "' not found"} ), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            ,})
        }
         
    } catch {
        return new NextResponse(JSON.stringify( {error: "Database Error"} ), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        ,})
    }finally {
        await client.close();
    }

    
}