export default function Footer() {
    return (
        <footer className="bg-black text-white w-full mt-8">
            <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ml-10">
                    <div >
                        <h3 className="text-lg font-semibold mb-4 text-gray-300">Навігація</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                                    Головна
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                                    Всі категорії
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                                    Умови використання
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-300">Наші магазини</h3>
                        <div className="space-y-3">
                            <div className="text-gray-400">
                                <p className="font-medium text-white">Київ</p>
                                <p className="text-sm">вул. Житомирська 15</p>
                            </div>
                            <div className="text-gray-400">
                                <p className="font-medium text-white">Житомир</p>
                                <p className="text-sm">вул. Шевченка 45</p>
                            </div>
                            <div className="text-gray-400">
                                <p className="font-medium text-white">Вінниця</p>
                                <p className="text-sm">вул. Петлюри 90</p>
                            </div>
                        </div>
                    </div>

                    {/* Контакти та соціальні мережі */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-300">Контакти</h3>
                        <div className="space-y-3">
                            <div className="text-gray-400">
                                <p className="text-sm">+380 (44) 123-45-67</p>
                                <p className="text-sm">info@example.com</p>
                            </div>
                            <div className="pt-3">
                                <p className="text-sm text-gray-300 mb-2">Соціальні мережі:</p>
                                <div className="flex space-x-4">
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                                        Instagram
                                    </a>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                                        Facebook
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
                        <p className="text-gray-400 text-sm">
                            &copy; {new Date().getFullYear()} Всі права захищені
                        </p>
                        <div className="flex space-x-6 text-sm">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                                Політика конфіденційності
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                                Угода користувача
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}