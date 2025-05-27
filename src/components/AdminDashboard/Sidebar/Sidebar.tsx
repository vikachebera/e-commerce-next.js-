'use client'
import Link from "next/link";
import {usePathname} from "next/navigation";
import clsx from "clsx";

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { name: "Продукти", href: "/admin/products" },
        { name: "Категорії", href: "/admin/categories" },
        { name: "Замовлення", href: "/admin/orders" },
    ];

    return (
        <aside className="w-64 bg-white shadow-md p-4">
            <div className="p-4 border-b">
                <h1 className="text-xl font-bold">Адмін панель</h1>
            </div>
            <nav className="space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={clsx(
                            "block px-4 py-2 rounded hover:bg-gray-200",
                            pathname === item.href && "bg-blue-100 font-semibold"
                        )}
                    >
                        {item.name}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}

