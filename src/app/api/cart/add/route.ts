import {NextRequest, NextResponse} from 'next/server';
import prisma from '@lib/prisma';
import {authOptions} from '@/app/api/auth/[...nextauth]/options';
import {getServerSession} from 'next-auth';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({error: 'Неавторизовано'}, {status: 401});
        }

        const body = await req.json();
        const productId = Number(body.productId);
        const quantity = Number(body.quantity ?? 1);
        if (!productId) {
            return NextResponse.json({error: 'productId обов’язковий'}, {status: 400});
        }

        const userId = Number(session?.user?.id);


        const existingItem = await prisma.cartItem.findFirst({
            where: {userId, productId}
        });

        let updatedItem;

        if (existingItem) {
            updatedItem = await prisma.cartItem.update({
                where: {id: existingItem.id},
                data: {quantity: existingItem.quantity + 1}
            });
        } else {
            updatedItem = await prisma.cartItem.create({
                data: {
                    userId,
                    productId,
                    quantity
                },
            });
        }
        return NextResponse.json(updatedItem, {status: 200});
    } catch (error) {
        console.error('Помилка при додаванні до кошика:', error);
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});

    }

}