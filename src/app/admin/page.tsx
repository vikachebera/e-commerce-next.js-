'use client'
import {useState} from "react";
import ProductsManager from "@/components/AdminDashboard/ProductsManager";
import CategoryManager from "@/components/AdminDashboard/CategoryManager";
import OrderManager from "@/components/AdminDashboard/OrderManager";

export default function AdminPage() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [activeSection, setActiveSection] = useState("dashboard");

    const renderActiveSection = () => {
        switch (activeSection) {
            case "products":
                return <ProductsManager/>;
            case "categories":
                return <CategoryManager/>;
            case "orders":
                return <OrderManager/>;
            default:
                return <ProductsManager />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">

            <div className="flex-1 overflow-auto">
                <main className="p-6">
                    {renderActiveSection()}
                </main>
            </div>
        </div>
    );
}