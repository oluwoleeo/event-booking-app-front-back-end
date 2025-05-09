/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor  } from '@testing-library/react';
import { useRequireAuth } from '@/app/hooks'
import AllEventsPage from '@/app/events/page';
// import NavbarPanel from '@/app/NavbarPanel';
import { getEvents } from '@/app/utils/api';

jest.mock('@/app/hooks', () => ({
    useRequireAuth: jest.fn(),
}))

jest.mock('@/app/utils/api', () => ({
    getEvents: jest.fn(),
}));

jest.mock('@/app/NavbarPanel', () => () => <div data-testid="navbar">Mock Navbar</div>);

jest.mock('@/app/events/components/EventCard', () => ({ event }) => (
    <div data-testid="event-card">{event.title}</div>
));


describe('Events page', () => {
    const token = 'ghfhe5465';
    const events = [
        { id: 1, title: 'Event One' },
        { id: 2, title: 'Event Two' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    
        (useRequireAuth as jest.Mock).mockReturnValue({token});

        (getEvents as jest.Mock).mockResolvedValue({status: 200, data: events});
    });

    it('is rendered without fetching any events', () => {
        (useRequireAuth as jest.Mock).mockReturnValue(null);

        render(<AllEventsPage/>);
        
        expect(getEvents).not.toHaveBeenCalled();
        expect(screen.getByText('All Events')).toBeInTheDocument();
        expect(screen.queryByTestId('event-card')).not.toBeInTheDocument();
    });

    it('renders events when API call is successful', async () => {
        render(<AllEventsPage />);
        
        expect(screen.getByTestId('navbar')).toBeInTheDocument();
        expect(screen.getByText('All Events')).toBeInTheDocument();
        
        await waitFor(() => {
            expect(screen.getAllByTestId('event-card')).toHaveLength(events.length);
            expect(screen.getByText('Event One')).toBeInTheDocument();
            expect(screen.getByText('Event Two')).toBeInTheDocument();
        });
    });

    it('displays error message when API call fails', async () => {        
        (getEvents as jest.Mock).mockResolvedValue({status: 401, data: { message: 'Unauthenticated' }});
        
        render(<AllEventsPage />);
        
        await waitFor(() => {
            expect(screen.getByText('Unauthenticated')).toBeInTheDocument();
        });
    });

    it('displays error message when API call throws an exception', async () => {
        (useRequireAuth as jest.Mock).mockReturnValue(token);
        (getEvents as jest.Mock).mockRejectedValue(new Error('Network Error'));
        
        render(<AllEventsPage />);
        
        await waitFor(() => {
            expect(screen.getByText('Network Error')).toBeInTheDocument();
        });
    });
})