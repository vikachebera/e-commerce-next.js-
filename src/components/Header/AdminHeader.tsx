'use client'
import { LogOut } from "lucide-react";

export default function AdminHeader() {
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm">
            <div className="text-2xl font-bold text-gray-800">
                Admin Panel
            </div>

            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold">
                    A
                </div>

                <button
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition"
                    onClick={() => {
                        // TODO: реалізувати логіку виходу
                        console.log("Logout clicked");
                    }}
                >
                    <LogOut className="w-4 h-4" />
                    Вийти
                </button>
            </div>
        </header>
    );
}
