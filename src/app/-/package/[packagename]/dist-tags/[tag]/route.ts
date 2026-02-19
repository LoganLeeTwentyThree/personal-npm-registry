import { NextRequest, NextResponse } from "next/server";
import { getPackageRoot, hash, modifyPackage } from "@/lib/database";
import { headers } from "next/headers";
import semverRegex from 'semver-regex';

export async function GET(
request: NextRequest,
    { params }: { params: Promise<{ packagename: string, tag: string}> },
)
{
    
    const newTag = JSON.stringify(request.body)

    if(semverRegex().test(newTag) == false)
    {
        return new NextResponse("{error: invalid tag}",
        {
            status: 400,
            headers: { "Content-Type": "application/json" }
        })
    }

    const packageName = (await params).packagename
    const pack = await getPackageRoot(packageName, "dist-tags")

    if(!pack)
    {
        return new NextResponse("{error: not found}",
        {
            status: 404,
            headers: { "Content-Type": "application/json" }
        })
    }

    const headersList = await headers()
    
    const bearer = headersList.get('authorization')
    const token = bearer?.split(" ")[1]

    const hashToken = hash(token ?? "")
    
    if(!pack.maintainers?.includes(hashToken))
    {
        return new NextResponse("{error: unauthorized}",
        {
            status: 401,
            headers: { "Content-Type": "application/json" }
        })
    }

    const {dist_tags, ...rest} = pack
    
    const tag = (await params).tag
    dist_tags![tag] == newTag

    pack.dist_tags = dist_tags

    await modifyPackage(pack, hashToken)
    
    return new NextResponse("{ok: true}",
    {
        status: 200,
        headers: { "Content-Type": "application/json" }
    })
    
}

export async function DELETE(
request: NextRequest,
    { params }: { params: Promise<{ packagename: string, tag: string}> },
)
{
    const tag = (await params).tag

    if(tag === "latest")
    {
        return new NextResponse("{error: forbidden}",
        {
            status: 403,
            headers: { "Content-Type": "application/json" }
        })
    
    }

    const packageName = (await params).packagename

    const pack = await getPackageRoot(packageName, "dist-tags")

    if(!pack)
    {
        return new NextResponse("{error: not found}",
        {
            status: 404,
            headers: { "Content-Type": "application/json" }
        })
    }

    const headersList = await headers()
    
    const bearer = headersList.get('authorization')
    const token = bearer?.split(" ")[1]

    const hashToken = hash(token ?? "")
    
    if(!pack.maintainers?.includes(hashToken))
    {
        return new NextResponse("{error: unauthorized}",
        {
            status: 403,
            headers: { "Content-Type": "application/json" }
        })
    }

    const {dist_tags, ...rest} = pack

    delete dist_tags![tag]

    pack.dist_tags = dist_tags

    await modifyPackage(pack, hashToken)
    
    return new NextResponse("{ok: true}",
    {
        status: 200,
        headers: { "Content-Type": "application/json" }
    })
    
}