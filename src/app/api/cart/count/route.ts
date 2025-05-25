import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ count: 0 }, { status: 401 });
    }

    const count = await prisma.cartItem.count({
        where: {
            user: {
                email: session.user.email,
            },
        },
    });

    return NextResponse.json({ count });
}
