import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/options";
import prisma from "@lib/prisma";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({error: 'Неавторизовано'}, {status: 401});
    }

    try {
        const { itemId } = await req.json();

        await prisma.cartItem.delete({
            where: {
                id: itemId,
                userId: Number(session.user.id)
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Помилка при видаленні товару з кошика' },
            { status: 500 }
        );
    }
}