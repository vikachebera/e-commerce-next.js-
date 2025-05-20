import Link from "next/link";
import {signIn} from "next-auth/react";

export default function GitHubGoogleProviders() {

    return (
        <> <Link href={"/register"}>Не зареєстровані? Зареєструватися</Link>
            <button

                onClick={() => signIn('google')}
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
            <button onClick={() => signIn('github')}
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