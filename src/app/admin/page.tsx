'use client'
import {useState} from "react";
import Sidebar from "@/components/AdminDashboard/Sidebar/Sidebar";
import ProductsManager from "@/components/AdminDashboard/ProductsManager";

export default function AdminPage() {
    const [activeSection, setActiveSection] = useState("dashboard");

    const renderActiveSection = () => {
        switch (activeSection) {
            // case "dashboard":
            //     return <Dashboard />;
            case "products":
                return <ProductsManager/>;
            // case "categories":
            //     return <CategoriesManager />;
            // case "orders":
            //     return <OrdersManager />;
            // case "users":
            //     return <UsersManager />;
            // default:
            //     return <Dashboard />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar activeSection={activeSection} setActiveSection={setActiveSection}/>

            <div className="flex-1 overflow-auto">
                {/*<AdminHeader activeSection={activeSection} />*/}

                <main className="p-6">
                    {renderActiveSection()}
                </main>
            </div>
        </div>
    );
}