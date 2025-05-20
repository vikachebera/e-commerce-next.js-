import { render, screen } from '@testing-library/react'
import Footer from "@/components/Footer/Footer"

describe('Footer', () => {
    it('renders navigation links', () => {
        render(<Footer />)

        expect(screen.getByText('Головна')).toBeInTheDocument()
        expect(screen.getByText('Всі категорії')).toBeInTheDocument()
        expect(screen.getByText('Умови використання')).toBeInTheDocument()
    })

    it('renders store locations', () => {
        render(<Footer />)

        expect(screen.getByText('Київ')).toBeInTheDocument()
        expect(screen.getByText('Житомир')).toBeInTheDocument()
        expect(screen.getByText('Вінниця')).toBeInTheDocument()
    })

    it('renders contact information', () => {
        render(<Footer />)

        expect(screen.getByText('+380 (44) 123-45-67')).toBeInTheDocument()
        expect(screen.getByText('info@example.com')).toBeInTheDocument()
    })

    it('renders social media links', () => {
        render(<Footer />)

        expect(screen.getByText('Instagram')).toBeInTheDocument()
        expect(screen.getByText('Facebook')).toBeInTheDocument()
    })

    it('renders copyright notice', () => {
        render(<Footer />)

        const currentYear = new Date().getFullYear()
        expect(screen.getByText(`© ${currentYear} Всі права захищені`)).toBeInTheDocument()
    })

    it('renders policy links', () => {
        render(<Footer />)

        expect(screen.getByText('Політика конфіденційності')).toBeInTheDocument()
        expect(screen.getByText('Угода користувача')).toBeInTheDocument()
    })
})
