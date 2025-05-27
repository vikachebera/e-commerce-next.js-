import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { getServerSession } from "next-auth";
import  {authOptions} from "@/app/api/auth/[...nextauth]/options";
import { Toaster } from 'react-hot-toast';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "ADMIN";

    return (
        <html lang="en">
        <body>

        {!isAdmin && <Header />}
        {children}
        {!isAdmin && <Footer />}
        <Toaster position="top-center" />
        </body>
        </html>
    );
}
