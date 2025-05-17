import Link from "next/link";

export default function Header() {
    return (
        <header className="grid grid-cols-8 m-3  ">

            <div className="col-span-6 font-bold  text-xl p-3">Tech Space</div>
            <div className="col-span-2 flex  items-end space-x-4 gap-4 ">
                <Link href={"/"}
                      className="px-6 py-2 rounded-md transition-colors duration-300 text-white bg-black"
                >Головна</Link>
                <Link href={"/catalog"}
                      className="px-6 py-2 rounded-md  transition-colors duration-300 text-white bg-black"
                >Каталог</Link>
                <Link href={"/login"}
                      className="px-6 py-2 rounded-md  transition-colors duration-300 text-white bg-black"
                >Вхід</Link>

            </div>

        </header>
    )
}