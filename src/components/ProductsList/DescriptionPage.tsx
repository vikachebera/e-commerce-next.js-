'use client'
import {useEffect, useState} from "react";
import {Product} from "@prisma/client";
import LoadingSpinner from "@/components/Loader/LoadingSpinner";
import AddToCart from "@/components/Buttons/AddToCart";
import Link from "next/link";

export default function DescriptionPage({product: initialProduct}: { product: Product | null }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [product, setProduct] = useState<Product | null>(initialProduct);

    useEffect(() => {
        if (!initialProduct?.id) {
            setLoading(false);
            setError("Товар не знайдено");
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/product/${initialProduct.id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setProduct(data);
            } catch (error) {
                console.error("Failed to fetch product", error);
                setError("Не вдалося завантажити товар");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [initialProduct?.id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoadingSpinner/>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Помилка</h2>
                    <div className="text-red-500 text-lg">{error}</div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Товар не знайдено</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-8">

                <div className="max-w-7xl mx-auto px-6">
                    <nav className="text-sm breadcrumbs mb-4">
                        <Link href="/"
                              className="opacity-80 hover:opacity-100 hover:underline transition-all duration-200">
                            Головна
                        </Link>
                        <span className="mx-2 opacity-60">/</span>
                        <a href={`/categories/${product.categoryId}`}
                           className="opacity-80 hover:opacity-100 hover:underline transition-all duration-200">
                            Категорія
                        </a>

                        <span className="mx-2 opacity-60">/</span>
                        <span className="font-medium">{product.name}</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div
                    className="bg-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm border border-white/20">
                    <div className="lg:flex">
                        <div className="lg:w-1/2 p-8">
                            <div className="relative group">
                                <div
                                    className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
                                <img
                                    src={product.imageUrl ?? "/placeholder.jpg"}
                                    alt={product.name}
                                    className="relative w-full h-auto object-cover rounded-2xl shadow-lg group-hover:shadow-2xl transition-shadow duration-300"
                                />
                                {product.stock <= 5 && product.stock > 0 && (
                                    <div
                                        className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                                        Залишилось {product.stock} шт
                                    </div>
                                )}
                                {product.stock <= 0 && (
                                    <div
                                        className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                                        Немає в наявності
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="lg:w-1/2 p-8">
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-4xl font-bold mb-4 text-gray-900 leading-tight">{product.name}</h1>
                                </div>

                                <div
                                    className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                                    <div className="flex items-baseline space-x-2">
                                        <span className="text-4xl font-bold text-blue-600">
                                            {product.price.toLocaleString()}
                                        </span>
                                        <span className="text-xl text-blue-600 font-medium">грн</span>
                                    </div>

                                </div>

                                <div className="bg-gray-50 rounded-2xl p-6">
                                    <h3 className="text-xl font-semibold mb-3 text-gray-800 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                        Опис товару
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <AddToCart
                                        productId={product.id}
                                        disabled={product.stock <= 0}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 bg-gradient-to-r from-gray-50 to-slate-50 p-8">
                        <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">Додаткова інформація</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                                <div className="flex items-center mb-4">
                                    <div
                                        className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                                        </svg>
                                    </div>
                                    <h4 className="font-semibold text-gray-800 text-lg">Характеристики</h4>
                                </div>
                                <p className="text-gray-600 leading-relaxed">Детальні технічні характеристики та
                                    специфікації товару для професійного використання</p>
                            </div>

                            <div
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                                <div className="flex items-center mb-4">
                                    <div
                                        className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                                        </svg>
                                    </div>
                                    <h4 className="font-semibold text-gray-800 text-lg">Доставка</h4>
                                </div>
                                <p className="text-gray-600 leading-relaxed">Безкоштовна доставка по Україні від 1000
                                    грн. Швидка доставка в день замовлення</p>
                            </div>

                            <div
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                                <div className="flex items-center mb-4">
                                    <div
                                        className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                                        </svg>
                                    </div>
                                    <h4 className="font-semibold text-gray-800 text-lg">Гарантія</h4>
                                </div>
                                <p className="text-gray-600 leading-relaxed">Офіційна гарантія виробника 24 місяці з
                                    можливістю розширеної гарантії</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}