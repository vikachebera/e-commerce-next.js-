import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { getServerSession } from "next-auth";
import  {authOptions} from "@/app/api/auth/[...nextauth]/options";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "ADMIN"; // 👈 або інша логіка

    return (
        <html lang="en">
        <body>
        {!isAdmin && <Header />}
        {children}
        {!isAdmin && <Footer />}
        </body>
        </html>
    );
}
