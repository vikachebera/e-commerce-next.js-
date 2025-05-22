"use client"
import {useEffect, useState} from "react";
import {Category, Product} from "@prisma/client";
import ProductList from "@/components/Blocks/ProductList";

export default function CategoryProducts({category}: { category: Category }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        if (!category?.id) {
            setLoading(false);
            setProducts([]);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/categories/${category.id}/products`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setProducts(data);
            } catch (err) {
                console.error("Failed to fetch products", err);
                setError("Не вдалося завантажити продукти");
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [category?.id]);

    if (loading) {
        return (
            <div className="p-4">
                <h2 className="flex justify-center items-center text-xl font-bold mb-4 text-center">
                    {category.name}
                </h2>
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <span className="ml-3">Завантаження...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Продукти в категорії: {category.name}</h2>
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4 text-center">{category.name}</h2>
            {products.length === 0 ? (
                <p className="text-gray-500">Немає продуктів у цій категорії</p>
            ) : (
                <ProductList products={products}/>
            )}
        </div>
    );
}