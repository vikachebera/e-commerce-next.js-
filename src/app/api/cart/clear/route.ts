import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/options";
import prisma from "@lib/prisma";
import {NextResponse} from "next/server";

export async function POST() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({error: 'Неавторизовано'}, {status: 401});
    }

    try {
        await prisma.cartItem.deleteMany({
            where: { userId: Number(session.user.id) }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Помилка при очищенні кошика' },
            { status: 500 }
        );
    }
}