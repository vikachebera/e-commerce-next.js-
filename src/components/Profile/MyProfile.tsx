"use client"
import {User} from "@prisma/client";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {signOut} from "next-auth/react";
import {LogOut} from "lucide-react";

export default function MyProfile() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    })
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchSessionAndUser()
    }, [])

    const fetchSessionAndUser = async () => {
        try {
            const sessionRes = await fetch('/api/auth/session')

            const contentType = sessionRes.headers.get('content-type')
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Invalid response format')
            }

            const session = await sessionRes.json()

            if (!session?.user?.id) {
                router.push('/login')
                return
            }

            const userRes = await fetch(`/api/user/${session.user.id}`)
            const userData = await userRes.json()

            setUser(userData)
            setFormData({
                name: userData.name || "",
                email: userData.email,
                password: '',
            })
            setIsLoading(false)
        } catch (error) {
            console.error("Error:", error)
            setError("Не вдалось завантажити данні")
            setIsLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch(`/api/user/${user?.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                throw new Error('Update failed')
            }

            const updatedUser = await response.json()
            setUser(updatedUser)
            setIsEditing(false)
            await fetch('/api/auth/session', {method: 'POST'})
            router.refresh()
        } catch (error) {
            console.error("Failed to update user:", error)
            setError("Не вдалось оновити профіль. Спробуйте ще раз.")
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center py-8 text-lg">Завантаження...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center py-8 text-red-500 text-lg max-w-md mx-auto p-4 bg-white rounded-lg shadow">
                    {error}
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center py-8 text-lg max-w-md mx-auto p-4 bg-white rounded-lg shadow">
                    Користувача не знайдено
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen  py-8 px-4">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Мій профіль</h1>
                    <button
                        onClick={() => signOut({callbackUrl: '/'})}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition"
                    >
                        <LogOut className="w-4 h-4"/>
                        Вийти
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    {!isEditing ? (
                        <div className="space-y-5">
                            <div className="pb-4 border-b border-gray-100">
                                <h3 className="text-sm font-medium text-gray-500">Ім&#39;я</h3>
                                <p className="mt-1 text-lg font-medium">{user.name || "Не вказано"}</p>
                            </div>

                            <div className="pb-4 border-b border-gray-100">
                                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                                <p className="mt-1 text-lg font-medium">{user.email}</p>
                            </div>

                            <div className="pb-4 border-b border-gray-100">
                                <h3 className="text-sm font-medium text-gray-500">Пароль</h3>
                                <p className="mt-1 text-lg font-medium">••••••••</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Дата реєстрації</h3>
                                <p className="mt-1 text-lg font-medium">
                                    {new Date(user.createdAt).toLocaleDateString('uk-UA')}
                                </p>
                            </div>

                            <button
                                onClick={() => setIsEditing(true)}
                                className="mt-6 w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Редагувати профіль
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ім&apos;я
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Новий пароль
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Залиште порожнім, щоб не змінювати"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-3">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                    {isLoading ? "Збереження..." : "Зберегти зміни"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData({
                                            name: user.name || "",
                                            email: user.email || "",
                                            password: ''
                                        });
                                    }}
                                    className="flex-1 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Скасувати
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}