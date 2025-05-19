import prisma from "@lib/prisma";
import {CartItem, Product, User} from "@prisma/client";


type CartWithProduct = CartItem & { product: Product | null, user: User };

export default async function Cart() {
    const cart: CartWithProduct[] = await prisma.cartItem.findMany({
        include: {
            product: true,
            user: true
        }
    })

    return (
        <div>
            <h1>Кошик</h1>
            {cart.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl ">
                    {cart.map((cartItem) => (
                        <div key={cartItem.id}
                             className=" p-4 hover:shadow-lg transition-shadow bg-white">
                            <h2 className="text-xl font-semibold">{cartItem.product?.name}</h2>
                            <p className="text-blue-600 font-bold mt-2">
                                {cartItem.product?.price.toFixed(2)} грн
                            </p>
                            {cartItem.product?.description && (
                                <p className="mt-2 text-sm">{cartItem.product?.description}</p>
                            )}
                            <img
                                src={cartItem.product?.imageUrl ?? "/placeholder.jpg"}
                                alt={cartItem.product?.name ?? "Product"}
                            />


                        </div>
                    ))}
                </div>
            ) : (
                <h2 className="text-gray-500">Продукти не знайдені</h2>
            )}

        </div>
    )
}