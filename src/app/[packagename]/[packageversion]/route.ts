import { NextRequest, NextResponse } from 'next/server';
import { getPackageRoot } from '@/lib/database';



export async function GET(
    request: NextRequest,
        { params }: { params: Promise<{ packagename: string, packageversion: string }> },
    ) {
    const name = (await params).packagename;
    const version = (await params).packageversion;

    const pack = await getPackageRoot(name, '')

    if (!pack)
    {
        return new NextResponse(JSON.stringify( {error: "Not found", reason: "Package with name '" + name + "' and version '" + version + "' not found"} ), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
        })
        
    }

    if (!Object.keys(pack.versions).includes(version))
    {
        return new NextResponse(JSON.stringify( {error: "Not found", reason: "Package with name '" + name + "' and version '" + version + "' not found"} ), {
            status: 404,
        })
    }

    return new NextResponse(JSON.stringify( pack.versions[version] ), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
        }
    )
         
    

    
}