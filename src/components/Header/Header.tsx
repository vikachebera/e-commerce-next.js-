import Link from "next/link";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/options";

export default async function Header() {
    const session = await getServerSession(authOptions);

    return (
        <header className="grid grid-cols-8 m-3 h-1/5">
            <Link href='/' className="col-span-6 font-bold text-xl p-3">
                <div >Tech Space</div>
            </Link>
            <div className="col-span-2 flex items-end space-x-4 gap-4">
                <Link
                    href={"/catalog"}
                    className="px-6 py-2 rounded-md transition-colors duration-300 text-white bg-black"
                >
                    Каталог
                </Link>

                {session ? (
                    <Link
                        href="/profile"
                        className="px-6 py-2 rounded-md transition-colors duration-300 text-white bg-black"
                    >
                        Мій профіль
                    </Link>
                ) : (
                    <Link
                        href="/login"
                        className="px-6 py-2 rounded-md transition-colors duration-300 text-white bg-black"
                    >
                        Вхід
                    </Link>
                )}

                <Link
                    href={session ? "/cart" : "/login"}
                    className="px-6 py-2 rounded-md transition-colors duration-300 text-white bg-black"
                >
                    Кошик
                </Link>
            </div>
        </header>
    );
}
