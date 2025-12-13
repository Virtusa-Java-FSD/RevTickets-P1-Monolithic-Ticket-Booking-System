import api from './api';
import { AuthRequest, AuthResponse, User } from '../types/auth'; // We'll need to define these types

// Define types locally if not yet available in a shared types file
// You can move these to src/types/auth.ts later
export interface AuthRequest {
    email: string; // or username depending on backend
    password: string;
    // Add other fields for registration if needed (e.g., name, mobileNumber)
    name?: string;
    mobileNumber?: string;
    role?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
    message?: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}

export const authService = {
    login: async (credentials: AuthRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    register: async (userData: AuthRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/register', userData);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: (): User | null => {
        const userStr = localStorage.getItem('user');
        if (userStr) return JSON.parse(userStr);
        return null;
    },
};
