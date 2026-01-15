import { deletePackageTarball, generateTokenFromUUID } from "@/lib/database"
import { headers } from "next/headers"
import { NextRequest } from "next/server"

export async function DELETE(
    request: NextRequest,
        { params }: { params: Promise<{ packagename: string, tarballfile: string, revision : string }> },
    ) {
    
    const packageName = (await params).packagename
    const tarballfile = (await params).tarballfile
    const headersList = await headers()

    const bearer = headersList.get('authorization')
    const uuid = bearer?.split(" ")[1]

    const token = generateTokenFromUUID(uuid)

    return await deletePackageTarball(tarballfile, token)

    
    
}