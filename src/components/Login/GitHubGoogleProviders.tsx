"use client"
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function GitHubGoogleProviders() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [activeProvider, setActiveProvider] = useState<"google" | "github" | null>(null);

    const handleOAuthLogin = async (provider: "google" | "github") => {
        setIsLoading(true);
        setActiveProvider(provider);
        setError("");

        try {
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
                router.replace("/admin");
            } else {
                router.replace("/");
            }
        } catch (err) {
            console.error("OAuth error:", err);
            setError("Помилка при вході. Спробуйте ще раз.");
        } finally {
            setIsLoading(false);
            setActiveProvider(null);
        }
    };

    return (
        <div className="space-y-4 p-4 max-w-md mx-auto">
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 text-red-700 text-sm rounded">
                    {error}
                </div>
            )}

            <div className="text-center text-sm text-gray-600">
                <span>Не зареєстровані? </span>
                <Link
                    href="/register"
                    className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                >
                    Зареєструватися
                </Link>
            </div>

            <div className="space-y-3">
                <button
                    onClick={() => handleOAuthLogin("google")}
                    disabled={isLoading}
                    className={`w-full flex items-center justify-center py-2.5 px-4 rounded-full border transition-all
                        ${isLoading && activeProvider === "google"
                        ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                        : "bg-white border-gray-300 hover:border-gray-400 hover:shadow-sm"}
                    `}
                >
                    {isLoading && activeProvider === "google" ? (
                        <div className="h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                    ) : (
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="Google"
                            width={20}
                            height={20}
                            className="mr-2"
                        />
                    )}
                    <span>Увійти через Google</span>
                </button>

                <button
                    onClick={() => handleOAuthLogin("github")}
                    disabled={isLoading}
                    className={`w-full flex items-center justify-center py-2.5 px-4 rounded-full border transition-all
                        ${isLoading && activeProvider === "github"
                        ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                        : "bg-white border-gray-300 hover:border-gray-400 hover:shadow-sm"}
                    `}
                >
                    {isLoading && activeProvider === "github" ? (
                        <div className="h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                    ) : (
                        <img
                            src="https://cdn.simpleicons.org/github"
                            alt="GitHub"
                            width={20}
                            height={20}
                            className="mr-2"
                        />
                    )}
                    <span>Увійти через GitHub</span>
                </button>
            </div>
        </div>
    );
}