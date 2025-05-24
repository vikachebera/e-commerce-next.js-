import CartClient from "@/components/Cart/CartClient";
import prisma from "@lib/prisma";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/options";

export default async function CartPage(){
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return <div>Будь ласка, увійдіть для перегляду кошика</div>;
    }

    const cart = await prisma.cartItem.findMany({
        where: { userId: Number(session.user.id) },
        include: { product: true, user: true }
    });

    const filteredCart = cart.filter(item => item.product !== null);

    return <CartClient initialCart={filteredCart} />;
}