import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { randomUUID } from "crypto";
import { insertPendingToken } from "@/lib/database";

export async function POST(
request: NextRequest)
{

    const token = "npm_" + randomUUID();

    await insertPendingToken(token)

    const headersList = await headers()
    const url = `http://${headersList.get("host") ?? "npm-registry:8000"}`

    return new NextResponse(JSON.stringify({
          "loginUrl": url + "/?id=" + token,
          "doneUrl": url + "/auth/" + token +"/done"}), 
      {
          status: 200,
          headers: { 
          "Content-Type" : "application/json"
          }
      }
  );
}