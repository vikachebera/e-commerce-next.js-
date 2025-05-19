// /app/api/user/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'

type Params = {
    params: {
        id: string
    }
}

export async function GET(
    req: NextRequest,
    { params }: Params
) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.id !== params.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const user = await prisma.user.findUnique({
        where: { id: Number(params.id) },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
        }
    })

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
}

export async function PUT(
    req: NextRequest,
    { params }: Params
) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.id !== params.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const data = await req.json()

    const updated = await prisma.user.update({
        where: { id: Number(params.id) },
        data: {
            name: data.name,
            email: data.email
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
        }
    })

    return NextResponse.json(updated)
}
