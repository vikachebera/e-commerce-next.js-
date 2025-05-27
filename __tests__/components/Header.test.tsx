import { render, screen, waitFor ,fireEvent} from '@testing-library/react';
import Header from '@/components/Header/Header';
import "@testing-library/jest-dom";

jest.mock("next/link", () => ({
    __esModule: true,
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}));
const mockPush = jest.fn();

global.fetch = jest.fn();

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
    usePathname: () => '/',
}));


describe("Header", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("показує кнопку входу для неавторизованих користувачів", async () => {
        (fetch as jest.Mock)
            .mockResolvedValueOnce({ json: () => Promise.resolve(null) }) // session
            .mockResolvedValueOnce({ json: () => Promise.resolve([]) }); // cart

        render(<Header />);

        await waitFor(() => {
            expect(screen.getByText("Вхід")).toBeInTheDocument();
            expect(screen.queryByText("Профіль")).not.toBeInTheDocument();
        });
    });



    it("завжди показує кнопку кошика", async () => {
        (fetch as jest.Mock)
            .mockResolvedValueOnce({ json: () => Promise.resolve(null) })
            .mockResolvedValueOnce({ json: () => Promise.resolve([]) });

        render(<Header />);

        await waitFor(() => {
            expect(screen.getByText("Кошик")).toBeInTheDocument();
        });
    });

    it('виконує пошук при сабміті форми', async () => {
        (fetch as jest.Mock)
            .mockResolvedValueOnce({ json: () => Promise.resolve(null) })
            .mockResolvedValueOnce({ json: () => Promise.resolve([]) });

        render(<Header />);

        const input = screen.getByPlaceholderText('Пошук...');
        fireEvent.change(input, { target: { value: 'ноутбук' } });

        const button = screen.getByRole('button');
        fireEvent.click(button);

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/search?q=%D0%BD%D0%BE%D1%83%D1%82%D0%B1%D1%83%D0%BA');
        });
    });
});