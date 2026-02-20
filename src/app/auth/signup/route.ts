import { NextRequest } from "next/server";
import { getUserByCredentials, insertUser, hash, setPendingToComplete } from "@/lib/database";

export async function POST(
    request: NextRequest,
        { params }: { params: Promise<{ }> },
    )
    {
    
    try{
        const body = await request.json()
        let result = await getUserByCredentials(body.Email ?? "", body.Password ?? "")

        if(result)
        {
            return new Response("{}", {
                    status: 403,
                }
            );
        }

        await insertUser(body.UUID, body.Email, body.Password)
        await setPendingToComplete(body.UUID)
        const token = hash(body.UUID)
        

        return new Response(JSON.stringify(token), {
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