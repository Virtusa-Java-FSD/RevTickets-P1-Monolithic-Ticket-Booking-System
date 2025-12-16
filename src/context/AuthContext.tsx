import React, { createContext, useContext, useEffect, useState } from "react";
import { loginRequest, registerRequest, googleSignIn } from "../utils/api";

type User = {
	id?: string;
	name?: string;
	email?: string;
	role?: string;
};

export const isAdmin = (user: User | null): boolean => {
	return user?.role === 'ADMIN';
};

type AuthState = {
	user: User | null;
	token: string | null;
	login: (email: string, password: string) => Promise<void>;
	register: (name: string, email: string, phone: string, password: string) => Promise<void>;
	loginWithGoogle: (idToken: string) => Promise<void>;
	logout: () => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

const STORAGE_KEY = "rev_auth";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const storedAuth = localStorage.getItem(STORAGE_KEY);
		if (storedAuth) {
			try {
				const authData = JSON.parse(storedAuth);
				if (authData.token && authData.user) {
					setToken(authData.token);
					setUser(authData.user);
					localStorage.setItem('token', authData.token);
				}
			} catch (error) {
				console.error('Failed to parse stored auth data:', error);
				localStorage.removeItem(STORAGE_KEY);
				localStorage.removeItem('token');
			}
		}
		setIsLoading(false);
	}, []);

	const persist = (tok: string | null, usr: User | null) => {
		setToken(tok);
		setUser(usr);
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: tok, user: usr }));
		if (tok) {
			localStorage.setItem('token', tok);
		} else {
			localStorage.removeItem('token');
		}
	};

	const login = async (email: string, password: string) => {
		const response = await loginRequest(email, password);
		if (response.token && response.user) {
			persist(response.token, response.user);
		} else {
			throw new Error('Invalid credentials');
		}
	};

	const register = async (name: string, email: string, phone: string, password: string) => {
		const response = await registerRequest(name, email, phone, password);
		if (response.token && response.user) {
			persist(response.token, response.user);
		} else {
			throw new Error('Registration failed');
		}
	};

	const logout = () => {
		persist(null, null);
		localStorage.removeItem(STORAGE_KEY);
		localStorage.removeItem('token');
		window.location.href = '/login';
	};

	const loginWithGoogle = async (idToken: string) => {
		const response = await googleSignIn(idToken);
		if (response.token && response.user) {
			persist(response.token, response.user);
		} else {
			throw new Error('Google sign-in failed');
		}
	};

	if (isLoading) {
		return <div className="loading-screen">Loading...</div>;
	}

	return (
		<AuthContext.Provider value={{ user, token, login, register, loginWithGoogle, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
};

export default AuthContext;
