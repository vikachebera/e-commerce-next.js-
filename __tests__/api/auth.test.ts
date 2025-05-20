import {signin, signup} from "@/app/actions/auth";
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { signIn } from 'next-auth/react';

jest.mock('@prisma/client', () => {
    const mockPrisma = {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
        $disconnect: jest.fn(),
    };
    return {
        PrismaClient: jest.fn(() => mockPrisma),
    };
});

jest.mock('bcrypt', () => ({
    hash: jest.fn(),
}));

jest.mock('next-auth/react');

const mockPrisma = new PrismaClient() as jest.Mocked<PrismaClient> & {
    user: {
        findUnique: jest.Mock;
        create: jest.Mock;
    };
};

const mockBcryptHash = bcrypt.hash as jest.MockedFunction<typeof bcrypt.hash>;


describe('signup', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('повинен повертати помилки при невалідних даних', async () => {
        const formData = new FormData();
        formData.append('name', 'a'); // занадто коротке ім'я
        formData.append('email', 'invalid-email'); // невалідний email
        formData.append('password', '123'); // занадто короткий пароль

        const result = await signup({}, formData);

        expect(result.errors).toBeDefined();
        expect(result.errors?.name).toEqual(["Імʼя повинно містити щонайменше 2 символи"]);
        expect(result.errors?.email).toEqual(["Некоректний email"]);
        expect(result.errors?.password).toEqual(["Пароль повинен бути щонайменше 6 символів"]);
    });


    it('повинен повертати помилку при існуючому email', async () => {
        mockPrisma.user.findUnique.mockResolvedValueOnce({
            id: 1,
            email: 'existing@example.com',
        });

        const formData = new FormData();
        formData.append('name', 'Valid Name');
        formData.append('email', 'existing@example.com');
        formData.append('password', 'validpassword');

        const result = await signup({}, formData);

        expect(result).toEqual({
            errors: {
                email: ["Користувач з таким email вже існує"],
            },
        });
    });

    it('повинен успішно створювати нового користувача', async () => {
        mockPrisma.user.findUnique.mockResolvedValueOnce(null);
        mockPrisma.user.create.mockResolvedValueOnce({
            id: 1,
            email: 'new@example.com',
            name: 'Valid Name',
            role: "USER",
        });
        mockBcryptHash.mockResolvedValueOnce('hashedpassword' as never);

        const formData = new FormData();
        formData.append('name', 'Valid Name');
        formData.append('email', 'new@example.com');
        formData.append('role', 'USER');
        formData.append('password', 'validpassword');

        const result = await signup({}, formData);

        expect(result).toEqual({ success: true });
        expect(mockBcryptHash).toHaveBeenCalledWith('validpassword', 10);
        expect(mockPrisma.user.create).toHaveBeenCalledWith({
            data: {
                name: 'Valid Name',
                email: 'new@example.com',
                role: 'USER',
                password: 'hashedpassword',
            },
        });
    });
});

describe('signin', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('повинен повертати помилки при невалідних даних', async () => {
        const formData = new FormData();
        formData.append('email', 'invalid-email');
        formData.append('password', '');

        const result = await signin({}, formData);

        expect(result.errors).toBeDefined();
        expect(result.errors?.email).toEqual(["Некоректний email"]);
        expect(result.errors?.password).toEqual(["Пароль обов'язковий"]);
    });

    it('повинен викликати signIn з правильними параметрами', async () => {
        const formData = new FormData();
        formData.append('email', 'valid@example.com');
        formData.append('password', 'password123');

        await signin({}, formData);

        expect(signIn).toHaveBeenCalledWith('credentials', {
            email: 'valid@example.com',
            password: 'password123',
            redirect: true,
            callbackUrl: '/',
        });
    });
});