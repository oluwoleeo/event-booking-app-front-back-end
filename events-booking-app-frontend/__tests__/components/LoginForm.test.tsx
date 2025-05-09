/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor  } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/app/componenets/LoginForm';
import { useAuth } from '@/app/contexts/AuthContext';
import { login } from '@/app/utils/auth';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('@/app/contexts/AuthContext', () => ({
    useAuth: jest.fn(),
}))

jest.mock('@/app/utils/auth', () => ({
    login: jest.fn(),
}));

describe('LoginForm', () => {
    const mockPush = jest.fn();
    const mockSetToken = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useRouter as jest.Mock).mockReturnValue({
            push: mockPush,
        });

        (useAuth as jest.Mock).mockReturnValue({
            setToken: mockSetToken,
        });
    });
    
    it('renders login form with message', () => {
        render(<LoginForm message="Welcome back!" />);

        expect(screen.getAllByText('Login')).toHaveLength(2);
        expect(screen.getByText('Welcome back!')).toBeInTheDocument();
    });
    
    it('updates form fields on user input', () => {
        render(<LoginForm/>);

        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');
        
        fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        
        expect(emailInput).toHaveValue('user@example.com');
        expect(passwordInput).toHaveValue('password123');
    });

    it('handles successful login', async () => {
        (login as jest.Mock).mockResolvedValue({
            status: 200,
            data: { token: 'zxcvbnm' },
        });
        
        render(<LoginForm/>);
        fireEvent.change(screen.getByPlaceholderText('Email'), {
            target: { value: 'user@example.com' },
        });
        
        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: 'password123' },
        });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(mockSetToken).toHaveBeenCalledWith('zxcvbnm');
            expect(mockPush).toHaveBeenCalledWith('/events');
        });
    });

    it('displays error message on unsuccessful login', async () => {
        (login as jest.Mock).mockResolvedValue({
            status: 401,
            data: { message: 'Invalid credentials' },
        });
        
        render(<LoginForm/>);
        fireEvent.change(screen.getByPlaceholderText('Email'), {
            target: { value: 'user@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: 'wrongpassword' },
        });
        
        fireEvent.click(screen.getByRole('button', { name: /login/i }));
        
        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        });
    });
    
    it('displays error message on network error', async () => {
        (login as jest.Mock).mockRejectedValue({
            message: 'Network Error',
        });
        
        render(<LoginForm/>);
        
        fireEvent.change(screen.getByPlaceholderText('Email'), {
            target: { value: 'user@example.com' },
        });
        
        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: 'password123' },
        });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));
        
        await waitFor(() => {
            expect(screen.getByText('Network Error')).toBeInTheDocument();
        });
    });
});