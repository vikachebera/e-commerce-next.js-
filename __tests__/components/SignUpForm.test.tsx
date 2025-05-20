import {render, screen} from '@testing-library/react';
import SignUpForm from "@/components/Register/SignUpForm";

describe('SignUpForm', () => {
    it('renders the form correctly', () => {
        render(<SignUpForm/>);

        expect(screen.getByText(/Реєстрація/i)).toBeInTheDocument();

        expect(screen.getByLabelText(/Ім'я/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Пароль/i)).toBeInTheDocument();

        expect(screen.getByRole('button', {name: /зареєструватися/i})).toBeInTheDocument();
    });
});
