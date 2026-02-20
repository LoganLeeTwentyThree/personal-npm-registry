import { NextRequest } from "next/server";
import { getUserByCredentials, setPendingToComplete } from "@/lib/database";

export async function POST(
    request: NextRequest,
        { params }: { params: Promise<{ }> },
    )
    {

    try{
        const body = await request.json()
        let result = await getUserByCredentials(body.Email ?? "", body.Password ?? "")

        if(!result)
        {
            return new Response(JSON.stringify({}), {
                status: 404,
                }
            );
        }
        
        await setPendingToComplete(body.UUID)
        return new Response(JSON.stringify({token: result.token}), {
                status: 200,
            }
        );
        

    }catch{
        return new Response(JSON.stringify({}), {
            status: 400,
            }
        );
    }
    

    
    
}