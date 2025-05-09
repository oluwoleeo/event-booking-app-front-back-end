/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { useSearchParams, useRouter } from 'next/navigation';
import AuthForm from '@/app/componenets/AuthForm';
import { useAuth } from '@/app/contexts/AuthContext';

jest.mock('next/navigation', () => ({
    useSearchParams: jest.fn(),
    useRouter: jest.fn(),
}));

jest.mock('@/app/contexts/AuthContext', () => ({
    useAuth: jest.fn(),
}))

jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children }) => <div>{children}</div>,
    },
    AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('AuthForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        
        const mockGet = jest.fn().mockImplementation((key) => {
            const params = {
                /* showLogin: 'true',
                message: 'Welcome back!', */
            };

            return params[key] || null;
        });

        const mockPush = jest.fn();
        const mockSetToken = jest.fn();

        (useSearchParams as jest.Mock).mockReturnValue({
            get: mockGet,
        });

        (useRouter as jest.Mock).mockReturnValue({
            push: mockPush,
        });

        (useAuth as jest.Mock).mockReturnValue({
            setToken: mockSetToken,
        });
    });

    it('renders the Log in page', () => {
        render(<AuthForm />)
        
        const button = screen.getByRole('button', {name: 'Login'})
        expect(button).toBeInTheDocument()
    })

    it('renders the Sign up page when the button is clicked from the login page', () => {
        render(<AuthForm />)
        
        const signupButton = screen.getByRole('button', {name: 'Sign Up'})
        fireEvent.click(signupButton)

        const button = screen.getByRole('button', {name: 'Sign Up'})
        expect(button).toBeInTheDocument()
    })

    it('renders the login page when the Log In button is clicked from the signup page', () => {
        render(<AuthForm />)
        
        const signupButton = screen.getByRole('button', {name: 'Sign Up'})
        fireEvent.click(signupButton)

        const loginButton = screen.getByRole('button', {name: 'Log In'})
        fireEvent.click(loginButton)

        const button = screen.getByRole('button', {name: 'Login'})
        expect(button).toBeInTheDocument()
    })

    it('passes message to Login', () => {
        /* const mockGet = jest.fn().mockImplementation((key) => {
            const params = {
                message: 'Welcome back!',
            };

            return params[key] || null;
        });


        (useSearchParams as jest.Mock).mockReturnValue({
            get: mockGet,
        }); */

        (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('message=Welcome back!'));

        render(<AuthForm />)
        
        const button = screen.getByText('Welcome back!')
        expect(button).toBeInTheDocument()
    })
})