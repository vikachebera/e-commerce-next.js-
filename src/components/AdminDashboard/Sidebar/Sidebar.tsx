import { LayoutGrid, Package, ShoppingCart, Users, Settings, LogOut } from "lucide-react";
import SidebarItem from "@/components/AdminDashboard/Sidebar/SidebarItem";

 interface SessionInterface {
     activeSection: string;
     setActiveSection: (section: string) => void;
 }
export default function Sidebar({ activeSection, setActiveSection }:SessionInterface) {
    return (
        <div className="w-64 bg-white shadow-md">
            <div className="p-4 border-b">
                <h1 className="text-xl font-bold">Адмін панель</h1>
            </div>
            <nav className="p-2">
                <ul className="space-y-1">
                    <SidebarItem
                        icon={<LayoutGrid size={20} />}
                        title="Дашборд"
                        isActive={activeSection === "dashboard"}
                        onClick={() => setActiveSection("dashboard")}
                    />
                    <SidebarItem
                        icon={<Package size={20} />}
                        title="Товари"
                        isActive={activeSection === "products"}
                        onClick={() => setActiveSection("products")}
                    />
                    <SidebarItem
                        icon={<LayoutGrid size={20} />}
                        title="Категорії"
                        isActive={activeSection === "categories"}
                        onClick={() => setActiveSection("categories")}
                    />
                    <SidebarItem
                        icon={<ShoppingCart size={20} />}
                        title="Замовлення"
                        isActive={activeSection === "orders"}
                        onClick={() => setActiveSection("orders")}
                    />
                    <SidebarItem
                        icon={<Users size={20} />}
                        title="Користувачі"
                        isActive={activeSection === "users"}
                        onClick={() => setActiveSection("users")}
                    />
                    <li className="pt-4 mt-4 border-t">
                        <SidebarItem
                            icon={<Settings size={20} />}
                            title="Налаштування"
                            onClick={() => {}}
                        />
                    </li>
                    <li>
                        <SidebarItem
                            icon={<LogOut size={20} />}
                            title="Вийти"
                            className="text-red-600"
                            onClick={() => {}}
                        />
                    </li>
                </ul>
            </nav>
        </div>
    );
}

