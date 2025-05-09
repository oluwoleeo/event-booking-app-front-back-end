/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor  } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import NavbarPanel from '@/app/NavbarPanel';
import { getAuthenticatedUser } from '@/app/utils/auth';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('@/app/contexts/AuthContext', () => ({
    useAuth: jest.fn(),
}))

jest.mock('@/app/utils/auth', () => ({
    getAuthenticatedUser: jest.fn(),
}));

describe('NavbarPanel', () => {
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

    it('renders Navbar and all elements successfully', () => {
        render(<NavbarPanel/>);
        
        expect(screen.getByText('Events Booking App')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
        expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    it('displays the actions when the dropdown is toggled on', () => {
        render(<NavbarPanel/>);
        
        expect(screen.getByText('Events Booking App')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
        expect(screen.getByText('Actions')).toBeInTheDocument();

        const dropdownButton = screen.getByText('Actions');

        fireEvent.click(dropdownButton)

        expect(screen.getByText('Create event')).toBeInTheDocument();
        expect(screen.getByText('View all your events')).toBeInTheDocument();
        expect(screen.getByText('View your bookings')).toBeInTheDocument();
    });

    it('does not display the actions when the dropdown is toggled off', () => {
        render(<NavbarPanel/>);
        
        expect(screen.getByText('Events Booking App')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
        expect(screen.getByText('Actions')).toBeInTheDocument();

        const dropdownButton = screen.getByText('Actions');

        fireEvent.click(dropdownButton)
        
        expect(screen.getByText('Create event')).toBeInTheDocument();
        expect(screen.getByText('View all your events')).toBeInTheDocument();
        expect(screen.getByText('View your bookings')).toBeInTheDocument();

        fireEvent.click(dropdownButton)

        expect(screen.queryByText('Create event')).toBeNull();
        expect(screen.queryByText('View all your events')).toBeNull();
        expect(screen.queryByText('View your bookings')).not.toBeInTheDocument();
    });

    it('displays username when user is logged in', async () => {
        (useAuth as jest.Mock).mockReturnValue({
            setToken: mockSetToken,
            token: 'vcvyedud',
        });

        (getAuthenticatedUser as jest.Mock).mockResolvedValue('Oluwole O');
        render(<NavbarPanel/>);
        
        expect(await screen.findByText('Hi, Oluwole O!')).toBeInTheDocument();
    });
})