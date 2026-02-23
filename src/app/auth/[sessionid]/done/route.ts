import { NextRequest } from "next/server";
import { checkToken } from "@/lib/database";
import { UUIDRecord } from "@/types";

export async function GET(
    request: NextRequest,
        { params }: { params: Promise<{ sessionid: String }> },
    )
    {

    const result : UUIDRecord | null = await checkToken((await params).sessionid as string)

    if(!result)
    {
        return new Response(JSON.stringify({}), {
            status: 404,
            }
        );
    }
    
    if(result.status === "pending")
    {
        return new Response(JSON.stringify({}), {
            status: 202,
            }
        );
    }
    
    return new Response(JSON.stringify({token: result.token}), {
            status: 200,
        }
    );
    

    
    
}