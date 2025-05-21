import AdminHeader from "@/components/Header/AdminHeader";
import Sidebar from "@/components/AdminDashboard/Sidebar/Sidebar";

export default function AdminLayout({
                                        children,
                                    }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar/>
            <div className="flex-1 flex flex-col overflow-auto">
                <AdminHeader/>
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}