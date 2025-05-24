import prisma from "@lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { itemId, newQuantity } = await req.json();

    if (newQuantity < 1) {
        await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
        await prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity: newQuantity }
        });
    }

    return NextResponse.json({ success: true });
}
