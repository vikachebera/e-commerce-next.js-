import prisma from "@/lib/prisma";
import {Product, Category} from '@prisma/client';
import Categories from "@/components/Categories/Categories";
import Carousel from "@/components/Carousel/Carousel";

type ProductWithCategory = Product & { category: Category | null };


export default async function Home() {
    try {
        const allProducts: ProductWithCategory[] = await prisma.product.findMany({
            include: {
                category: true,
            },
        });

        return (
            <main className="grid grid-cols-12 bg-gray-50">
                <Categories/>
                <div className="flex flex-col items-center p-8 col-span-10 border-solid border-l-1 border-l-gray-500">
                    <Carousel/>

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
                                    <button className="bg-black text-white border-2 rounded-md p-2 m-2 flex ">Додати до
                                        кошика
                                    </button>

                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">Продукти не знайдені</p>
                    )}
                </div>
            </main>
        );
    } catch (error) {
        console.error('Помилка при завантаженні продуктів:', error);
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500">Сталася помилка при завантаженні даних</p>
            </div>

        );
    }
}
