"use client"
import {Product} from "@prisma/client";
import ProductCard from "@/components/Blocks/ProductCard";
import Link from "next/link";

interface ProductListProps {
    products: Product[];
}

export default function ProductList({products}: ProductListProps) {
    return (
        <div className="flex flex-row w-full justify-center flex-wrap ">
            {products.map((product) => (
                <div key={product.id} className="w-1/5 m-1">
                    <Link href={`/product/${product.id}`}>
                        <ProductCard product={product}/>
                    </Link>
                </div>
            ))}
        </div>
    );
}