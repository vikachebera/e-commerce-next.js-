import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from "@/components/Login/Login";
import { signIn } from 'next-auth/react';

jest.mock('next-auth/react');

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));
describe('Login component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders email and password inputs and submit button', () => {
        render(<Login />);

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/пароль/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /увійти/i })).toBeInTheDocument();
    });

    it('allows typing into inputs', () => {
        render(<Login />);

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/пароль/i);

        fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
        fireEvent.change(passwordInput, { target: { value: '123456' } });

        expect(emailInput).toHaveValue('user@example.com');
        expect(passwordInput).toHaveValue('123456');
    });

    it('calls signIn with email and password on submit', async () => {
        (signIn as jest.Mock).mockResolvedValueOnce({ ok: true });

        render(<Login />);

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'test@example.com' },
        });

        fireEvent.change(screen.getByLabelText(/пароль/i), {
            target: { value: 'password123' },
        });

        fireEvent.click(screen.getByRole('button', { name: /увійти/i }));

        await waitFor(() => {
            expect(signIn).toHaveBeenCalledWith('credentials', {
                email: 'test@example.com',
                password: 'password123',
                redirect: false,
            });
        });
    });

    it('shows error message if signIn returns error', async () => {
        (signIn as jest.Mock).mockResolvedValueOnce({ error: 'Invalid credentials' });

        render(<Login />);

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'wrong@example.com' },
        });

        fireEvent.change(screen.getByLabelText(/пароль/i), {
            target: { value: 'wrongpass' },
        });

        fireEvent.click(screen.getByRole('button', { name: /увійти/i }));

        expect(await screen.findByText('Невірний email або пароль')).toBeInTheDocument();
    });
});
