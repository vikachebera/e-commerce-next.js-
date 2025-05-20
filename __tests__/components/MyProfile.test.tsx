import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import MyProfile from '@/components/Profile/MyProfile'
import '@testing-library/jest-dom'
import React from 'react'

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        refresh: jest.fn(),
    }),
}))

global.fetch = jest.fn()

const mockUser = {
    id: '123',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedpassword',
    createdAt: new Date(),
}

afterEach(() => {
    jest.clearAllMocks()
})

test('завантаження і відображення профілю', async () => {
    ;(fetch as jest.Mock).mockImplementation((url) => {
        if (url === '/api/auth/session') {
            return Promise.resolve({
                headers: { get: () => 'application/json' },
                json: () => Promise.resolve({ user: { id: '123' } }),
            })
        }
        if (url === '/api/user/123') {
            return Promise.resolve({
                json: () => Promise.resolve(mockUser),
            })
        }
        return Promise.reject('Unknown URL')
    })

    render(<MyProfile />)

    expect(screen.getByText(/Завантаження/)).toBeInTheDocument()

    await screen.findByText("Мій профіль")
    expect(screen.getByText(mockUser.name)).toBeInTheDocument()
    expect(screen.getByText(mockUser.email)).toBeInTheDocument()
})

test('перемикання на редагування профілю', async () => {
    ;(fetch as jest.Mock).mockImplementation((url) => {
        if (url === '/api/auth/session') {
            return Promise.resolve({
                headers: { get: () => 'application/json' },
                json: () => Promise.resolve({ user: { id: '123' } }),
            })
        }
        if (url === '/api/user/123') {
            return Promise.resolve({
                json: () => Promise.resolve(mockUser),
            })
        }
        return Promise.reject('Unknown URL')
    })

    render(<MyProfile />)

    await screen.findByText("Редагувати профіль")
    fireEvent.click(screen.getByText("Редагувати профіль"))

    expect(screen.getByLabelText(/Ім'я/)).toHaveValue(mockUser.name)
    expect(screen.getByLabelText(/Email/)).toHaveValue(mockUser.email)
})


