export interface Category {
    id: number;
    name: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    confirmpassword?: string;
}

export interface Event {
    id: number;
    name: string;
    start_date: Date;
    end_date: Date;
    description: string;
    max_capacity: number;
    category?: Category;
}

export interface User {
    id: number;
    firstname: string;
    lastname: string;
}

export interface Attendee {
    ticket_id?: string;
    first_name: string;
    last_name: string;
}

export interface CreateEvent {
    name: string;
    start_date: Date | string;
    end_date: Date | string;
    description: string;
    category: string;
    max_capacity?: number;
}

export interface UpdateEvent {
    name?: string;
    start_date?: Date | string;
    end_date?: Date | string;
    description?: string;
    category?: string;
    max_capacity?: number;
}

export interface CreateBooking {
    attendees: Attendee[]
}

export interface Booking {
    id: number;
    attendees: Attendee[]
    event: Event
}