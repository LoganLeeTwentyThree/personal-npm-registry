import { NextRequest, NextResponse } from "next/server";
import dotenv from 'dotenv'
const { MongoClient } = require('mongodb');
import { headers } from 'next/headers';
const crypto = require('crypto');
import { generateTokenFromUUID, getUserByToken } from "@/lib/database";

export async function GET(
request: NextRequest,
    { params }: { params: Promise<{ }> },
)
{
    const headersList = await headers();
    const bearer = headersList.get('Authorization')

    let uuid = bearer?.split(" ")[1]

    if( uuid != null)
    {
        const token = generateTokenFromUUID(uuid)
        const user = await getUserByToken(token)
        if( user != null)
        {
            return new NextResponse(JSON.stringify({"username" : user.name }), 
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            })

        }else
        {
            return new NextResponse(JSON.stringify({"Error" : "User Not Found"}), 
            {
                status: 401,
                headers: { },
            }
            );
        }
    }else
    {
        return new NextResponse(JSON.stringify({}), 
        {
            status: 400,
            headers: { },
        }
    );
    }
}