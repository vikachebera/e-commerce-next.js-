import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const handlers = {
    GET: async () => {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Неавторизовано' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: Number(session?.user?.id) },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const orders = await prisma.order.findMany({
            where: { userId: user.id },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        return NextResponse.json(orders);
    }
};

export const GET = handlers.GET;