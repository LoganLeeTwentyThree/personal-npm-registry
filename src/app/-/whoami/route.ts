import { NextRequest, NextResponse } from "next/server";
import { headers } from 'next/headers';
import { hash, getUserByToken } from "@/lib/database";

export async function GET(
request: NextRequest,
    { params }: { params: Promise<{ }> },
)
{
    const headersList = await headers();
    const bearer = headersList.get('Authorization')

    let uuid = bearer?.split(" ")[1]

    if( !uuid )
    {
        return new NextResponse(JSON.stringify({}), 
        {
            status: 400,
            headers: { "Content-Type": "application/json"  },
        }
        );
    }

    const token = hash(uuid)
    const user = await getUserByToken(token)
    if( !user )
    {
        return new NextResponse(JSON.stringify({"Error" : "User Not Found"}), 
            {
                status: 404,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    return new NextResponse(JSON.stringify({"email" : user.email }), 
    {
        status: 200,
        headers: { "Content-Type": "application/json" },
    })
    
}