import { NextResponse} from 'next/server';
import {getServerSession} from 'next-auth';
import {authOptions} from '@/app/api/auth/[...nextauth]/options';
import prisma from '@lib/prisma';

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Неавторизовано' }, { status: 401 });
    }

    const cartItems = await prisma.cartItem.findMany({
        where: { userId: Number(session.user.id) },
    });

    return NextResponse.json(cartItems, { status: 200 });
}
