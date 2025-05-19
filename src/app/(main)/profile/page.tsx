"use client"
import MyProfile from "@/components/Profile/MyProfile";
import OrderList from "@/components/Profile/OrderList";
import {useState} from "react";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("profile");

    return (
        <div className="max-w-6xl  px-4 py-8">
            <div className="flex flex-col md:flex-row ">

                <nav className="md:w-2/6">
                    <ul className="space-y-2">
                        <li
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                activeTab === "profile"
                                    ? "bg-gray-900 text-white"
                                    : "hover:bg-gray-200"
                            }`}
                            onClick={() => setActiveTab("profile")}
                        >
                            Мій профіль
                        </li>
                        <li
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                activeTab === "orders"
                                    ? "bg-gray-900 text-white"
                                    : "hover:bg-gray-200"
                            }`}
                            onClick={() => setActiveTab("orders")}
                        >
                            Мої замовлення
                        </li>
                    </ul>
                </nav>

                <div className="md:w-5/6">
                    {activeTab === "profile" && <MyProfile/>}
                    {activeTab === "orders" && <OrderList/>}
                </div>
            </div>
        </div>
    )
}