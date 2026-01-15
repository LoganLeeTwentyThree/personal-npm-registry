const { MongoClient } = require('mongodb');
import dotenv from 'dotenv'
import { Timestamp } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { PackageRoot, PackageVersionObject } from '@/types';
import { getPackageRoot } from '@/lib/database';



export async function GET(
    request: NextRequest,
        { params }: { params: Promise<{ packagename: string, packageversion: string }> },
    ) {
    const name = (await params).packagename;
    const version = (await params).packageversion;

    const response = await (await getPackageRoot(name, '')).json()

    if (response == null)
    {
        return new NextResponse(JSON.stringify( {error: "Not found", reason: "Package with name '" + name + "' and version '" + version + "' not found"} ), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
        })
        
    }

    if (!Object.keys(response.versions).includes(version))
    {
        return new NextResponse(JSON.stringify( {error: "Not found", reason: "Package with name '" + name + "' and version '" + version + "' not found"} ), {
            status: 404,
        })
    }

    return new NextResponse(JSON.stringify( response.versions[version] ), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
        }
    )
         
    

    
}