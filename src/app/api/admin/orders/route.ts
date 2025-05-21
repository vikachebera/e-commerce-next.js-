import prisma from "@lib/prisma";
import { NextResponse} from "next/server";

const handlers = {
    GET: async () => {
        try {
            const orders = await prisma.order.findMany();

            return NextResponse.json(orders, {status: 200});

        } catch (error) {
            console.error(error);
            return NextResponse.json('Internal server error', {status: 500})
        }


    }


}

export const GET = handlers.GET;
