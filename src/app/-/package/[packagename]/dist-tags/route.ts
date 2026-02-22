import { NextRequest, NextResponse } from "next/server";
import { getPackageRoot } from "@/lib/database";

export async function GET(
request: NextRequest,
    { params }: { params: Promise<{ packagename: string}> },
)
{
    
    const packageName = (await params).packagename
    const pack = await getPackageRoot(packageName, "dist-tags")

    if(pack)
    {
        if(pack['dist-tags'])
        {
            return new NextResponse(JSON.stringify(pack['dist-tags']),
            {
                status: 200,
                headers: { "Content-Type": "application/json" }
            })
        }

        return new NextResponse("{}",
        {
            status: 200,
            headers: { "Content-Type": "application/json" }
        })
        
    }

    return new NextResponse("{error: not found}",
    {
        status: 404,
        headers: { "Content-Type": "application/json" }
    })
}