import {NextRequest} from 'next/server';
import {GET, PUT} from '@/app/api/user/[id]/route';
import {getServerSession} from 'next-auth';
import {Session} from 'next-auth';
import * as bcrypt from 'bcryptjs';
import prisma from '@lib/prisma';
import {Role} from '@prisma/client';

jest.mock('next-auth');
jest.mock('bcryptjs', () => ({
    ...jest.requireActual('bcryptjs'),
    hash: jest.fn().mockImplementation(() => Promise.resolve('hashed_password')),
}));

jest.mock('@lib/prisma', () => ({
    __esModule: true,
    default: {
        user: {
            findUnique: jest.fn(),
            update: jest.fn(),
        },
    },
}));

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;
const mockBcryptHash = bcrypt.hash as jest.MockedFunction<typeof bcrypt.hash>;
const mockPrismaUser = prisma.user as jest.Mocked<typeof prisma.user>;

describe('/api/users/[id]', () => {
    const mockRequest = {json: jest.fn()} as unknown as NextRequest;
    const mockParams = {params: Promise.resolve({id: '1'})};

    const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: Role.USER,
        createdAt: new Date(),
        emailVerified: null,
        password: null,
        image: null,
    };

    const mockSession: Session = {
        user: {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            role: Role.USER,
        },
        expires: '2024-12-31',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET', () => {
        it('повертає профіль авторизованого користувача', async () => {
            mockGetServerSession.mockResolvedValue(mockSession);
            mockPrismaUser.findUnique.mockResolvedValue(mockUser);

            const response = await GET(mockRequest, mockParams);

            expect(response.status).toBe(200);
            const responseData = await response.json();
            expect(responseData).toMatchObject({
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                role: Role.USER,
            });
        });

        it('повертає 401 для неавторизованого користувача', async () => {
            mockGetServerSession.mockResolvedValue(null);

            const response = await GET(mockRequest, mockParams);

            expect(response.status).toBe(401);
            const responseData = await response.json();
            expect(responseData.error).toBe('Unauthorized');
        });

        it('повертає 403 для чужого профілю', async () => {
            const otherUserSession: Session = {
                user: {
                    id: '2',
                    name: 'Jane Smith',
                    email: 'jane@example.com',
                    role: Role.USER,
                },
                expires: '2024-12-31',
            };
            mockGetServerSession.mockResolvedValue(otherUserSession);

            const response = await GET(mockRequest, mockParams);

            expect(response.status).toBe(403);
            const responseData = await response.json();
            expect(responseData.error).toBe('Forbidden');
        });

        it('повертає 404 якщо користувача не існує', async () => {
            mockGetServerSession.mockResolvedValue(mockSession);
            mockPrismaUser.findUnique.mockResolvedValue(null);

            const response = await GET(mockRequest, mockParams);

            expect(response.status).toBe(404);
            const responseData = await response.json();
            expect(responseData.error).toBe('User not found');
        });
    });

    describe('PUT', () => {
        beforeEach(() => {
            mockGetServerSession.mockResolvedValue(mockSession);
            (mockRequest.json as jest.Mock).mockClear();
        });

        it('оновлює користувача без пароля', async () => {
            (mockRequest.json as jest.Mock).mockResolvedValue({
                name: 'Updated Name',
                email: 'updated@example.com',
            });
            mockPrismaUser.update.mockResolvedValue(mockUser);

            const response = await PUT(mockRequest, mockParams);

            expect(response.status).toBe(200);
            expect(mockPrismaUser.update).toHaveBeenCalledWith({
                where: {id: 1},
                data: {name: 'Updated Name', email: 'updated@example.com'},
                select: expect.any(Object),
            });
        });

        it('оновлює користувача з паролем', async () => {
            (mockRequest.json as jest.Mock).mockResolvedValue({
                name: 'Updated Name',
                password: 'newpassword',
            });
            mockPrismaUser.update.mockResolvedValue(mockUser);

            const response = await PUT(mockRequest, mockParams);

            expect(response.status).toBe(200);
            expect(mockBcryptHash).toHaveBeenCalledWith('newpassword', 10);
            expect(mockPrismaUser.update).toHaveBeenCalledWith({
                where: {id: 1},
                data: {name: 'Updated Name', password: 'hashed_password'},
                select: expect.any(Object),
            });
        });

        it('повертає 403 для чужого профілю', async () => {
            const otherUserSession: Session = {
                user: {
                    id: '2',
                    name: 'Jane Smith',
                    email: 'jane@example.com',
                    role: Role.USER,
                },
                expires: '2024-12-31',
            };
            mockGetServerSession.mockResolvedValue(otherUserSession);

            const response = await PUT(mockRequest, mockParams);

            expect(response.status).toBe(403);
            const responseData = await response.json();
            expect(responseData.error).toBe('Forbidden');
        });
    });
});