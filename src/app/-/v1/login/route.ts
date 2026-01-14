import { NextRequest, NextResponse } from "next/server";
import dotenv from 'dotenv'
import { randomUUID } from "crypto";
const { MongoClient } = require('mongodb');

export async function POST(
request: NextRequest)
{
    dotenv.config({ path: '../../../.env.local' })
    const url = process.env.APP_BASE_URL
    const token = "npm_" + randomUUID();

    const uri = process.env.DATABASE_STRING;

    const client = new MongoClient(uri);

    try {
      const database = client.db('private-npm');
      const temp_ids = database.collection('temp-uuids');

      await temp_ids.insertOne({token: token, status: "pending", inserttime: new Date()})
    } finally {
      await client.close();
    }


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