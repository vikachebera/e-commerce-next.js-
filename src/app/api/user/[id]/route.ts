import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import { getServerSession } from 'next-auth'
import bcrypt from 'bcryptjs'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'

export async function GET(
    req: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {

    const resolvedParams = await params;

    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (Number(session.user.id) !== Number(resolvedParams.id)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
        where: { id: Number(resolvedParams.id )},
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
}

export async function PUT(
    req: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params;

    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.id !== resolvedParams.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await req.json();

    const updated = await prisma.user.update({
        where: { id: Number(resolvedParams.id )},
        data: {
            name: data.name,
            email: data.email,
            ...(data.password && { password: await bcrypt.hash(data.password, 10) })

        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });

    return NextResponse.json(updated);
}
