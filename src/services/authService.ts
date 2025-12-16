import api from './api';
import { AuthRequest, AuthResponse, User } from '../types/auth';

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

    forgotPassword: async (email: string): Promise<{ message: string }> => {
        const response = await api.post<{ message: string }>('/auth/forgot-password', { email });
        return response.data;
    },

    resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
        const response = await api.post<{ message: string }>('/auth/reset-password', { token, newPassword });
        return response.data;
    },

    validateResetToken: async (token: string): Promise<{ valid: boolean; message?: string }> => {
        const response = await api.get<{ valid: boolean; message?: string }>(`/auth/validate-reset-token?token=${token}`);
        return response.data;
    },
};
