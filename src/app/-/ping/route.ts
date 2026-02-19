import { NextRequest, NextResponse } from "next/server";

export async function GET(
request: NextRequest
)
{
    return new NextResponse("{ok: true}",
    {
        status: 200,
        headers: { "Content-Type": "application/json" }
    })
}