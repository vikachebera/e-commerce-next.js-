'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from "@/components/Loader/LoadingSpinner";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const res = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError('Невірний email або пароль');
            setLoading(false);
            return;
        }

        try {
            const userRes = await fetch('/api/user/me');
            const user = await userRes.json();

            if (user?.role === 'ADMIN') {
                router.replace('/admin');
            } else {
                window.location.href = '/';
            }
        } catch (err) {
            console.error(err);
            setError('Помилка при завантаженні ролі');
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoadingSpinner/>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white mx-auto p-8 rounded-xl shadow-md w-full max-w-md border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Увійти</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
                    {error}
                </div>
            )}

            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="your@email.com"
                />
            </div>

            <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Пароль
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="••••••••"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                    loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-300'
                }`}
            >
                {loading ? 'Зачекайте...' : 'Увійти'}
            </button>
        </form>
    );
}