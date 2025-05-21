import prisma from "@lib/prisma";
import {NextRequest, NextResponse} from "next/server";
import { OrderStatus } from "@prisma/client";

type OrderItemInput = {
    id?: number;
    productId: number;
    quantity: number;
    price: number;
};

const handlers = {
    GET: async (req: NextRequest, {params}: { params: Promise<{ id: string }> }) => {
        const resolvedItem = await params;
        try {
            const order = await prisma.order.findUnique({
                where: {id: Number(resolvedItem.id)},
            })
            return NextResponse.json(order, {status: 200})
        } catch (error) {
            console.log(error);
            return NextResponse.json("Internal server error ", {status: 500});
        }

    },
    PUT: async (req: NextRequest, {params}: { params: Promise<{ id: string }> }) => {
        const resolvedItem = await params;
        try {
            const orderId = Number(resolvedItem.id);
            const { total, status, orderItems }: {
                total: number;
                status: OrderStatus;
                orderItems: OrderItemInput[];
            } = await req.json();
            const existingItems = await prisma.orderItem.findMany({
                where: { orderId },
            });

            const incomingIds = orderItems.filter((i) => i.id !== undefined).map((i) => i.id!);
            const existingIds = existingItems.map((i) => i.id);

            const toDelete = existingIds.filter((id) => !incomingIds.includes(id));

            const deleteOps = prisma.orderItem.deleteMany({
                where: {
                    id: { in: toDelete },
                },
            });

            const updateOps = orderItems
                .filter((item) => item.id !== undefined)
                .map((item)  =>
                    prisma.orderItem.update({
                        where: { id: item.id },
                        data: {
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.price,
                        },
                    })
                );

            const createOps = orderItems
                .filter((item) => item.id === undefined)
                .map((item) =>
                    prisma.orderItem.create({
                        data: {
                            orderId,
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.price,
                        },
                    })
                );

            const orderUpdate = prisma.order.update({
                where: { id: orderId },
                data: {
                    total,
                    status,
                },
            });

            await prisma.$transaction([
                deleteOps,
                ...updateOps,
                ...createOps,
                orderUpdate,
            ]);

            const updatedOrder = await prisma.order.findUnique({
                where: { id: orderId },
                include: { orderItems: true },
            });

            return NextResponse.json(updatedOrder, { status: 200 });
        } catch (error) {
            console.error(error);
            return NextResponse.json("Internal server error", { status: 500 });
        }
    },

    DELETE: async (req: NextRequest, {params}: { params: Promise<{ id: string }> }) => {
        const resolvedItem = await params;
        try {
            await prisma.orderItem.deleteMany({
                where: {orderId: Number(resolvedItem.id)},
            });
            await prisma.order.delete({
                where: {id: Number(resolvedItem.id)},
            });

            return NextResponse.json({success: true})

        } catch (error) {
            console.log(error);
            return NextResponse.json("Internal server error ", {status: 500});
        }
    },

}

export const GET = handlers.GET;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;