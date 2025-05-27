'use client';
import {signup} from "@/app/actions/auth";
import {useActionState} from 'react';
import {FormState} from "@/types/definitions";
import {useEffect, useState} from "react";
import {signIn} from "next-auth/react";
import LoadingSpinner from "@/components/Loader/LoadingSpinner";

export default function SignUpForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [state, action] = useActionState<FormState, FormData>(async (prevState, formData) => {
        setIsSubmitting(true);
        setEmail(formData.get("email") as string);
        setPassword(formData.get("password") as string);
        const result = await signup(prevState, formData);
        setIsSubmitting(false);
        return result;
    }, {errors: {}});

    useEffect(() => {
        if (state?.success) {
            setIsSubmitting(true);
            signIn("credentials", {
                email,
                password,
                callbackUrl: "/",
            }).finally(() => setIsSubmitting(false));
        }
    }, [state, email, password]);

    return (
        <form action={action}
              className="bg-white mx-auto p-8 rounded-xl shadow-md w-full max-w-md border border-gray-100 m-5">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Реєстрація</h2>

            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Ім&apos;я <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        minLength={2}
                        required
                    />
                    {state?.errors?.name && state.errors.name.map((error: string, i: number) => (
                        <p key={i} className="mt-1 text-red-500 text-sm">{error}</p>
                    ))}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                    />
                    {state?.errors?.email && (
                        <p className="mt-1 text-red-500 text-sm">{state.errors.email}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Пароль <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        minLength={6}
                        required
                    />
                    {state?.errors?.password && (
                        <ul className="mt-1 text-red-500 text-sm space-y-1">
                            {state.errors.password.map((error: string) => (
                                <li key={error}>- {error}</li>
                            ))}
                        </ul>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors flex items-center justify-center ${
                        isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                >
                    {isSubmitting ? (
                        <>
                            <LoadingSpinner/>
                            Обробка...
                        </>
                    ) : (
                        'Зареєструватися'
                    )}
                </button>
            </div>
        </form>
    );
}