'use server';
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { FormState } from "@/types/definitions";
import { signIn } from "next-auth/react";

const prisma = new PrismaClient();

export async function signup(state: FormState, formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const errors: FormState["errors"] = {};
    if (!name || name.length < 2) {
        errors.name = ["Імʼя повинно містити щонайменше 2 символи"];
    }
    if (!email || !email.includes("@")) {
        errors.email = ["Некоректний email"];
    }
    if (!password || password.length < 6) {
        errors.password = ["Пароль повинен бути щонайменше 6 символів"];
    }
    if (Object.keys(errors).length > 0) {
        return { errors };
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return {
            errors: {
                email: ["Користувач з таким email вже існує"],
            },
        };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    return { success: true };
}

export async function signin(state: FormState, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const errors: FormState["errors"] = {};
    if (!email || !email.includes("@")) {
        errors.email = ["Некоректний email"];
    }
    if (!password) {
        errors.password = ["Пароль обов'язковий"];
    }

    if (Object.keys(errors).length > 0) {
        return { errors };
    }

    await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: "/",
    });

    return {};
}
