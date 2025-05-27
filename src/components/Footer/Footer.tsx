"use client"
export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 w-full mt-16">
            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-10">
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Навігація</h3>
                        <ul className="space-y-3">
                            {['Головна', 'Всі категорії', 'Умови використання', 'Акції'].map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-amber-400 transition-colors duration-300 text-base"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Наші магазини</h3>
                        <div className="space-y-4">
                            {[
                                {city: 'Київ', address: 'вул. Житомирська 15'},
                                {city: 'Житомир', address: 'вул. Шевченка 45'},
                                {city: 'Вінниця', address: 'вул. Петлюри 90'}
                            ].map((shop, index) => (
                                <div key={index} className="text-gray-400 group">
                                    <p className="font-medium text-white group-hover:text-amber-400 transition-colors duration-300">
                                        {shop.city}
                                    </p>
                                    <p className="text-sm mt-1 group-hover:text-gray-200 transition-colors duration-300">
                                        {shop.address}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Контакти</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-gray-400 hover:text-amber-400 transition-colors duration-300 cursor-pointer">
                                    +380 (44) 123-45-67
                                </p>
                                <p className="text-gray-400 hover:text-amber-400 transition-colors duration-300 cursor-pointer mt-1">
                                    info@example.com
                                </p>
                            </div>
                            <div className="pt-2">
                                <p className="text-sm text-gray-300 mb-3">Соціальні мережі:</p>
                                <div className="flex space-x-5">
                                    {['Instagram', 'Facebook', 'Telegram'].map((social) => (
                                        <a
                                            key={social}
                                            href="#"
                                            className="text-gray-400 hover:text-amber-400 transition-colors duration-300 text-sm"
                                        >
                                            {social}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="border-t border-gray-800 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-500 text-sm mb-4 md:mb-0">
                            &copy; {new Date().getFullYear()} Всі права захищені.
                        </p>
                        <div className="flex space-x-6">
                            {['Політика конфіденційності', 'Угода користувача'].map((item) => (
                                <a
                                    key={item}
                                    href="#"
                                    className="text-gray-500 hover:text-amber-400 text-sm transition-colors duration-300"
                                >
                                    {item}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}