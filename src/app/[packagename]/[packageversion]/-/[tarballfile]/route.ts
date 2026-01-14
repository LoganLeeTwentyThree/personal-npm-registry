import { NextRequest, NextResponse } from "next/server";



export async function GET(
  _request: NextRequest,
  { params }: {  params : Promise<{packagename: string, packageversion: string, tarballfile: string }>}
) {
    //due to nextjs routing limitations we can't have correct param names -_-
    const { packageversion, packagename, tarballfile } = await params;

    const scope = packagename
    const actualPackageName = packageversion
    
    //Scoped packages not a feature... yet?
    try {
        const upstream = await fetch(
            `https://registry.npmjs.org/${scope}/${actualPackageName}/-/${tarballfile}`
        );

        
        return new NextResponse(upstream.body, {
            status: upstream.status,
            headers: upstream.headers
        });
        
    }catch {
        return new NextResponse('Package not found', { status: 404 })
    }
    

}