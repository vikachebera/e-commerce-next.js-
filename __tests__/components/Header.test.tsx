import { render, screen, waitFor } from '@testing-library/react';
import Header from '@/components/Header/Header';
import "@testing-library/jest-dom";

// Mock для next/link
jest.mock("next/link", () => ({
    __esModule: true,
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}));

// Mock для глобального fetch
global.fetch = jest.fn();

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
            .mockResolvedValueOnce({ json: () => Promise.resolve(null) }) // session
            .mockResolvedValueOnce({ json: () => Promise.resolve([]) }); // cart

        render(<Header />);

        await waitFor(() => {
            expect(screen.getByText("Кошик")).toBeInTheDocument();
        });
    });


});