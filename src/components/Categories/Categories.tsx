import prisma from "@lib/prisma";
import { Category } from "@prisma/client";
import Link from "next/link";

export default async function Categories() {
    const categories: Category[] = await prisma.category.findMany();

    return (
        <nav className="col-span-2 bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <ul className="space-y-2">
                {categories.map((category) => (
                    <li key={category.id}>
                        <Link
                            href={`/categories/${category.id}`}
                            className={`
                                flex items-center py-2 px-3 rounded-md transition-all duration-200
                                text-gray-600 hover:text-indigo-600 hover:bg-indigo-50
                                group
                            `}
                        >
                            <span className="font-medium">{category.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}