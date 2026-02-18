import { NextRequest } from "next/server";
const { MongoClient } = require('mongodb');

type UUIDRecord = {
    uuid: String,
    status: String,
    token: String,
}
export async function GET(
    request: NextRequest,
        { params }: { params: Promise<{ sessionid: String }> },
    )
    {

    const uri = process.env.DATABASE_STRING;

    const client = new MongoClient(uri);

    var result : UUIDRecord
    try {
        const database = client.db('private-npm');
        const temp_ids = database.collection('temp-uuids');

        result = await temp_ids.findOne({token: (await params).sessionid})
    } finally {
      await client.close();
    }


    

    if(!result)
    {
        return new Response(JSON.stringify({}), {
            status: 404,
            }
        );
    }else{
        if(result.status == "pending")
        {
            return new Response(JSON.stringify({}), {
                status: 202,
                }
            );
        }else if(result.status == "complete")
        {
            return new Response(JSON.stringify({token: result.token}), {
                    status: 200,
                }
            );
        }

    }
    
}