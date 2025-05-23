import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { ShoppingCart, User } from "lucide-react";

export default async function Header() {
    const session = await getServerSession(authOptions);

    return (
        <header className="w-full bg-white/40 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-gray-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 md:h-20">
                    <Link
                        href="/"
                        className="flex items-center text-2xl font-bold text-gray-900 hover:text-indigo-600 transition-colors duration-300"
                    >
                        <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg mr-2">TS</span>
                        Tech Space
                    </Link>


                    <nav className="flex items-center space-x-2 sm:space-x-4">
                        {session ? (
                            <Link
                                href="/profile"
                                className="flex items-center px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-300 group"
                            >
                                <User className="h-5 w-5 mr-1 group-hover:scale-110 transition-transform" />
                                <span className="hidden sm:inline">Профіль</span>
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-300 group"
                            >
                                <User className="h-5 w-5 mr-1 group-hover:scale-110 transition-transform" />
                                <span className="hidden sm:inline">Вхід</span>
                            </Link>
                        )}

                        <Link
                            href={session ? "/cart" : "/login"}
                            className="flex items-center px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors duration-300 group relative"
                        >
                            <ShoppingCart className="h-5 w-5 mr-1 group-hover:scale-110 transition-transform" />
                            <span className="hidden sm:inline">Кошик</span>


                            {session && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    3
                                </span>
                            )}
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}