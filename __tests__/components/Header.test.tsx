import {render, screen} from '@testing-library/react'
import Header from "@/components/Header/Header";
import "@testing-library/jest-dom";

jest.mock("next-auth/next", () => ({
    getServerSession: jest.fn(),

}))

jest.mock("next/link", () => {
    const Link = ({children, href}: { children: React.ReactNode; href: string }) => {
        return <a href={href}>{children}</a>;
    };
    Link.displayName = "Link";
    return Link;

});

describe("Header", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("відображає 'Вхід', якщо користувач не авторизований", async () => {
        const {getServerSession} = await import("next-auth/next");
        (getServerSession as jest.Mock).mockResolvedValue(null);

        render(await Header());

        expect(screen.getByText("Вхід")).toBeInTheDocument();
        expect(screen.queryByText("Мій профіль")).not.toBeInTheDocument();
    });
    it("відображає 'Мій профіль', якщо користувач авторизований", async () => {
        const {getServerSession} = await import("next-auth/next");
        (getServerSession as jest.Mock).mockResolvedValue({
            user: {
                name: "Test User",
                email: "test@example.com",
            },
        });

        render(await Header());

        expect(screen.getByText("Мій профіль")).toBeInTheDocument();
        expect(screen.queryByText("Вхід")).not.toBeInTheDocument();
    });
});