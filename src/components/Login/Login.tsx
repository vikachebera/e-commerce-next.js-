'use client';
import {signIn} from 'next-auth/react';
import {useState} from 'react';
import {useRouter} from "next/navigation";


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError("Невірний email або пароль");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/user/me");
            const user = await res.json();

            if (user?.role === "ADMIN") {
                router.push("/admin");
            } else {
                router.push("/");
            }
        } catch (err) {
            console.log(err);
            setError("Помилка при завантаженні ролі");
        } finally {
            setLoading(false);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="bg-white mx-auto p-6 rounded-lg shadow w-3/6">
            <h2 className="text-xl font-semibold mb-4">Увійти</h2>

            {error && <p className="text-red-500 mb-2">{error}</p>}

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
            </div>

            <div className="mt-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Пароль
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 mt-4 rounded-md"
            >
                Увійти
            </button>
        </form>
    )
}
