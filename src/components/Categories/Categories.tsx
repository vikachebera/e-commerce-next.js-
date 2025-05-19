import prisma from "@lib/prisma";
import { Category } from "@prisma/client";

export default async function Categories() {
    const categories : Category[] = await prisma.category.findMany();
    return (
        <nav className="col-span-2   p-5">
            <h2 className="text-gray-6900  text-lg font-medium mb-4">Категорії</h2>
            <ul className="space-y-1">
                {categories.map(category => (
                    <li key={category.id}>
                        <a
                            href={`/categories/${category.id}`}
                            className="block py-2 px-3 text-gray-500 hover:text-gray-900 transition-colors duration-150"
                        >
                            {category.name}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}