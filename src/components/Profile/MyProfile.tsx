"use client"
import {User} from "@prisma/client";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";


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
            setError("Failed to update profile. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return <div className="text-center py-8">Завантаження...</div>
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">{error}</div>
    }

    if (!user) {
        return <div className="text-center py-8">User not found</div>

    }
    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Мій профіль</h2>

            {!isEditing ? (
                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Ім&apos;я</h3>
                        <p className="mt-1 text-lg">{user.name || "Not specified"}</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Email</h3>
                        <p className="mt-1 text-lg">{user.email}</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Пароль</h3>
                        <p className="mt-1 text-lg">
                            ********
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                        <p className="mt-1 text-lg">
                            {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                    </div>

                    <button
                        onClick={() => setIsEditing(true)}
                        className="mt-6 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
                    >
                        Редагувати профіль
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Ім&apos;я
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Новий пароль
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                        />
                    </div>

                    <div className="flex space-x-3 pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition disabled:opacity-50"
                        >
                            {isLoading ? "Збереження..." : "Зберегти зміни"}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setIsEditing(false);
                                setFormData({
                                    name: user.name || "",
                                    email: user.email ?? "",
                                    password: user.password ?? ""
                                });
                            }}
                            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
                        >
                            Відмінити
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}