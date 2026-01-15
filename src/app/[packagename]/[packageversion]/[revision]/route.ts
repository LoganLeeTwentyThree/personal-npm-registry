import { deletePackageMetaData, generateTokenFromUUID, modifyPackage } from '@/lib/database';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';



export async function DELETE(
    request: NextRequest,
        { params }: { params: Promise<{ packagename: string, packageversion: string, revision : string }> },
    ) {
    const packageName = (await params).packagename
    const revision = (await params).revision
    const headersList = await headers()

    const bearer = headersList.get('authorization')
    const uuid = bearer?.split(" ")[1]

    const token = generateTokenFromUUID(uuid)
    
    return await deletePackageMetaData(packageName, token)
}

export async function PUT(
    request: NextRequest,
        { params }: { params: Promise<{ packagename: string, packageversion: string, revision : string }> },
    ) {
    const packageName = (await params).packagename
    const revision = (await params).revision
    const headersList = await headers()

    const bearer = headersList.get('authorization')
    const uuid = bearer?.split(" ")[1]

    const token = generateTokenFromUUID(uuid)
    
    const body = await request.json();     
    return await modifyPackage(body, token)
}