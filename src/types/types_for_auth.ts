import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
        };
    }
    interface User {
        id: string;
        name: string;
        email: string;
        password?: string;
    }
}
declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        name: string;
        email: string;
    }
}