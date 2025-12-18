export type UserRole = 'USER' | 'ADMIN';

export interface User {
    id: number;
    email: string;
    name?: string;
    role: UserRole;
    phoneNumber?: string;
    address?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupCredentials {
    email: string;
    password: string;
    name?: string;
}

export interface VerifyOtpCredentials {
    email: string;
    otp: string;
}
