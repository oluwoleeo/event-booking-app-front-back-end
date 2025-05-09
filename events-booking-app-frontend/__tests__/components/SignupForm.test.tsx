/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor  } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import SignupForm from '@/app/componenets/SignupForm';
import { signup } from '@/app/utils/auth';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('@/app/utils/auth', () => ({
    signup: jest.fn(),
}));

describe('SignupForm', () => {
    const mockPush = jest.fn();
    
    beforeEach(() => {
        jest.clearAllMocks();
        
        (useRouter as jest.Mock).mockReturnValue({
            push: mockPush,
        });
    });
    
    it('renders sign up page successfully', () => {
        render(<SignupForm/>);
        
        expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
    });
    
    it('displays error when passwords do not match', () => {
        render(<SignupForm/>);
        
        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: 'Password123!' },
        });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
            target: { value: 'DifferentPassword!' },
        });
        
        expect(screen.getByText('Passwords does not match')).toBeInTheDocument();
    });
    
    it('submits the form successfully', async () => {
        (signup as jest.Mock).mockResolvedValue({ status: 201 });
        
        render(<SignupForm />);
        
        fireEvent.change(screen.getByPlaceholderText('First Name'), {
            target: { value: 'John' },
        });
        fireEvent.change(screen.getByPlaceholderText('Last Name'), {
            target: { value: 'Doe' },
        });
        fireEvent.change(screen.getByPlaceholderText('Email'), {
            target: { value: 'john.doe@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: 'Password123!' },
        });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
            target: { value: 'Password123!' },
        });
        
        fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
        
        await waitFor(() => {
            expect(signup).toHaveBeenCalledWith({
                firstname: 'John',
                lastname: 'Doe',
                email: 'john.doe@example.com',
                password: 'Password123!',
                confirmpassword: 'Password123!',
            });
            
            expect(mockPush).toHaveBeenCalledWith('/?showLogin=true&message=Account created successfully. Log in.');
        });
    });

    it('displays error message on signup failure', async () => {
        (signup as jest.Mock).mockResolvedValue({
            status: 400,
            data: { message: 'Email already exists' },
        });
        
        render(<SignupForm/>);
        
        fireEvent.change(screen.getByPlaceholderText('First Name'), {
            target: { value: 'John' },
        });
        fireEvent.change(screen.getByPlaceholderText('Last Name'), {
            target: { value: 'Doe' },
        });
        fireEvent.change(screen.getByPlaceholderText('Email'), {
            target: { value: 'john.doe@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: 'Password123!' },
        });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
            target: { value: 'Password123!' },
        });
        
        fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
        
        await waitFor(() => {
            expect(screen.getByText('Email already exists')).toBeInTheDocument();
        });
    });
})