import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/options";
import prisma from "@lib/prisma";
import {NextRequest, NextResponse} from "next/server";
import type {OrderItem} from "@prisma/client";

export const dynamic = 'force-dynamic';


interface RequestBody {
    total: number;
    orderItems: OrderItem[];
}

const handlers = {
    GET: async () => {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({error: 'Неавторизовано'}, {status: 401});
        }

        const user = await prisma.user.findUnique({
            where: {id: Number(session?.user?.id)},
        });

        if (!user) {
            return NextResponse.json({error: "User not found"}, {status: 404});
        }

        const orders = await prisma.order.findMany({
            where: {userId: user.id},
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        return NextResponse.json(orders);
    },

    POST: async (req: NextRequest) => {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({error: 'Неавторизовано'}, {status: 401});
        }

        const user = await prisma.user.findUnique({
            where: {id: Number(session?.user?.id)},
        });

        if (!user) {
            return NextResponse.json({error: "User not found"}, {status: 404});
        }

        const body: RequestBody = await req.json();

        const order = await prisma.order.create({
            data: {
                userId: user.id,
                status: "PENDING",
                total: Number(body.total) || 0,
                orderItems: {
                    create: body.orderItems.map((item: OrderItem) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        return NextResponse.json(order);
    }
};

export const GET = handlers.GET;
export const POST = handlers.POST;