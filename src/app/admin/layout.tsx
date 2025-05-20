import Footer from "@/components/Footer/Footer";
import AdminHeader from "@/components/Header/AdminHeader";

export default function AdminLayout({
                                        children,
                                    }: { children: React.ReactNode }) {
    return (
        <>
            <AdminHeader/>
            {children}

            <Footer/>
        </>
    )
}