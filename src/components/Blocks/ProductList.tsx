"use client"
import {Product} from "@prisma/client";
import ProductCard from "@/components/Blocks/ProductCard";
import Link from "next/link";

interface ProductListProps {
    products: Product[];
}

export default function ProductList({products}: ProductListProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full  ">
            {products.map((product) => (
                <div key={product.id} className="w-full m-1">
                    <Link href={`/product/${product.id}`}>
                        <ProductCard product={product}/>
                    </Link>
                </div>
            ))}
        </div>
    );
}