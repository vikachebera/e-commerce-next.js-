import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MyProfile from "@/components/Profile/MyProfile";
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('next-auth/react', () => ({
    signOut: jest.fn(),
}));


global.fetch = jest.fn();

describe('MyProfile', () => {
    const pushMock = jest.fn();
    const refreshMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useRouter as jest.Mock).mockReturnValue({
            push: pushMock,
            refresh: refreshMock,
        });
    });

    const userData = {
        id: '123',
        name: 'Іван',
        email: 'ivan@example.com',
        createdAt: new Date().toISOString(),
    };

    const sessionResponse = {
        user: {
            id: userData.id,
        },
    };

    it('показує завантаження спочатку', async () => {
        // fetch повертає валідну сесію і юзера
        (fetch as jest.Mock)
            .mockResolvedValueOnce({
                ok: true,
                headers: { get: () => 'application/json' },
                json: async () => sessionResponse,
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => userData,
            });

        render(<MyProfile />);

        expect(screen.getByText('Завантаження...')).toBeInTheDocument();

        // Чекаємо поки завантаження завершиться
        await waitFor(() => {
            expect(screen.getByText(userData.name)).toBeInTheDocument();
        });
    });

    it('редіректить на /login, якщо нема сесії', async () => {
        (fetch as jest.Mock)
            .mockResolvedValueOnce({
                ok: true,
                headers: { get: () => 'application/json' },
                json: async () => ({}), // пустий обʼєкт — нема user.id
            });

        render(<MyProfile />);

        await waitFor(() => {
            expect(pushMock).toHaveBeenCalledWith('/login');
        });
    });

    it('показує помилку при невдалій відповіді сервера', async () => {
        (fetch as jest.Mock)
            .mockRejectedValueOnce(new Error('Network error'));

        render(<MyProfile />);

        await waitFor(() => {
            expect(screen.getByText('Не вдалось завантажити данні')).toBeInTheDocument();
        });
    });



    it('викликає signOut при кліку на кнопку Вийти', async () => {
        (fetch as jest.Mock)
            .mockResolvedValueOnce({
                ok: true,
                headers: { get: () => 'application/json' },
                json: async () => sessionResponse,
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => userData,
            });

        render(<MyProfile />);

        await waitFor(() => {
            expect(screen.getByText(userData.name)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button', { name: /Вийти/i }));

        expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/' });
    });
});
