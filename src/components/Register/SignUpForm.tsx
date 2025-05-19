'use client';
import {signup} from "@/app/actions/auth";
import {useActionState} from 'react'
import {FormState} from "@/types/definitions";
import {useEffect, useState} from "react";
import { signIn } from "next-auth/react";


export default function SignUpForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [state, action, pending] = useActionState<FormState, FormData>(async (prevState, formData) => {
        setEmail(formData.get("email") as string);
        setPassword(formData.get("password") as string);
        return await signup(prevState, formData);
    }, { errors: {} });

    useEffect(() => {
        if (state?.success) {
            signIn("credentials", {
                email,
                password,
                callbackUrl: "/",
            });
        }
    }, [state]);
return (
    <form action={action} className="bg-white mx-auto p-6 rounded-lg shadow max-w-3xl">
        <h2 className="text-xl font-semibold mb-4">Реєстрація</h2>

        <div className="grid grid-cols-1 gap-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Ім&#39;я <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                    minLength={2}
                />
            </div>
            {state?.errors?.name && state.errors.name.map((error: string, i: number) => (
                <p key={i} className="text-red-500 text-sm">{error}</p>
            ))}


            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
            {state?.errors?.email && <p>{state.errors.email}</p>}


            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Пароль <span className="text-red-500">*</span>
                </label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    minLength={6}
                />
            </div>
            {state?.errors?.password && (
                <div>
                    <ul>
                        {state.errors.password.map((error: string) => (
                            <li key={error}>- {error}</li>
                        ))}
                    </ul>
                </div>
            )}
            <button
                disabled={Boolean(pending)}
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out disabled:opacity-50"
            >
                Зареєструватися
            </button>
        </div>
    </form>)
}