"use client"

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function GitHubGoogleProviders() {
    const router = useRouter();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error, setError] = useState("");
    const handleOAuthLogin = async (provider: "google" | "github") => {
        const res = await signIn(provider, { redirect: false });
        console.log("signIn response:", res);

        if (res?.error) {
            setError(res.error);
            return;
        }

        const userRes = await fetch("/api/user/me");
        const user = await userRes.json();
        console.log("User from API:", user);

        if (user?.role === "ADMIN") {
            console.log("Redirect to /admin");
            router.replace("/admin");
        } else if (user?.role === "USER") {
            console.log("Redirect to /");
            router.replace("/");
        } else {
            console.log("Unknown role, no redirect");
        }
    };

    return (
        <> <Link href={"/register"}>Не зареєстровані? Зареєструватися</Link>
            <button

                onClick={() => handleOAuthLogin("google")}
                className="mt-6 flex items-center justify-center bg-white border border-gray-300 rounded-full w-1/5 py-2 px-4 shadow hover:shadow-md transition text-sm"
            >
                <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google Logo"
                    width={20}
                    height={20}
                    className="mr-2"
                />
                Sign in with Google
            </button>
            <button
                onClick={() => handleOAuthLogin("github")
                }
                    className="mt-6 flex items-center justify-center bg-white border border-gray-300 rounded-full w-1/5 py-2 px-4 shadow hover:shadow-md transition text-sm"
            >
                <img
                    src="https://cdn.simpleicons.org/github"
                    alt="GitHub Logo"
                    width={20}
                    height={20}
                    className="mr-2"
                />
                Sign in with GitHub
            </button>
        </>
    )
}