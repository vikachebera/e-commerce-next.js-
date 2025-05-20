"use client"
import Login from "@/components/Login/Login";
import GitHubGoogleProviders from "@/components/Login/GitHubGoogleProviders";



export default function SignInPage() {

    return (
        <div className=" flex  flex-col justify-center items-center max-w-full m-5 p-5">

            <Login/>
            <GitHubGoogleProviders/>
        </div>


    )
}