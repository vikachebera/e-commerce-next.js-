import prisma from "@lib/prisma";
import {NextResponse, NextRequest} from "next/server";

const handlers = {
    GET: async (req: NextRequest,
                {params}: { params: Promise<{ id: string }> }) => {
        const resolvedParams = await params;
        try {
            const items = await prisma.orderItem.findMany({
                where: {orderId: Number(resolvedParams.id)},
                include: {
                    product: true
                }
            });
            return NextResponse.json(items,{status:200});

        } catch (err) {
            console.log(err)
            return NextResponse.json("Internal server error", {status: 500})
        }
    }

}

export const GET = handlers.GET