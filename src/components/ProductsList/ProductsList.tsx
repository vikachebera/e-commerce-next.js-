import prisma from "@lib/prisma";
import {Category, Product} from "@prisma/client";
import AddToCart from "@/components/Buttons/AddToCart";

type ProductWithCategory = Product & { category: Category | null };

export default async function ProductsList() {
    try {
        const allProducts: ProductWithCategory[] = await prisma.product.findMany({
            include: {
                category: true,
            },
        });

        return (
            <>
                <h1 className="text-2xl font-bold mb-6">Список товарів</h1>

                {allProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl ">
                        {allProducts.map((product) => (
                            <div key={product.id}
                                 className=" p-4 hover:shadow-lg transition-shadow bg-white">
                                <h2 className="text-xl font-semibold">{product.name}</h2>
                                <p className="text-gray-600">{product.category?.name}</p>
                                <p className="text-blue-600 font-bold mt-2">
                                    {product.price.toFixed(2)} грн
                                </p>
                                {product.description && (
                                    <p className="mt-2 text-sm">{product.description}</p>
                                )}
                                <AddToCart productId={product.id}/>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">Продукти не знайдені</p>
                )}</>
        )
    } catch (error) {
        console.error('Помилка при завантаженні продуктів:', error);
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500">Сталася помилка при завантаженні даних</p>
            </div>

        );
    }
}