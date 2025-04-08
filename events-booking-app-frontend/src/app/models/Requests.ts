interface Category {
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
    category: Category;
}

