import { NextRequest } from "next/server";
import { getUserByCredentials, insertUser, generateTokenFromUUID, setPendingToComplete } from "@/lib/database";

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

            await insertUser(body.UUID, body.Email, body.Password)
            await setPendingToComplete(body.UUID)
            const token = generateTokenFromUUID(body.UUID)
            

            return new Response(JSON.stringify(token), {
                    status: 200,
                }
            );
        }else{
            return new Response("{}", {
                    status: 403,
                }
            );
        }

    }catch{
        return new Response(JSON.stringify({}), {
            status: 400,
            }
        );
    }
    

    
    
}