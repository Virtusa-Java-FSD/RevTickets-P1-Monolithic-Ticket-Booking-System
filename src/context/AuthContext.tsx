import React, { createContext, useContext, useEffect, useState } from "react";
import { loginRequest, registerRequest } from "../utils/api";

type User = {
	id?: string;
	name?: string;
	email?: string;
	role?: string;
};

type AuthState = {
	user: User | null;
	token: string | null;
	login: (email: string, password: string) => Promise<void>;
	register: (name: string, email: string, phone: string, password: string) => Promise<void>;
	logout: () => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

const STORAGE_KEY = "rev_auth";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				setUser(parsed.user || null);
				setToken(parsed.token || null);
			}
		} catch (e) {
			// ignore
		} finally {
			setIsLoading(false);
		}
	}, []);

	const persist = (tok: string | null, usr: User | null) => {
		setToken(tok);
		setUser(usr);
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: tok, user: usr }));
		// Store token separately for API interceptor
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
		// Force page reload to ensure clean state
		window.location.href = '/login';
	};

	if (isLoading) {
		return <div className="loading-screen">Loading...</div>;
	}

	return (
		<AuthContext.Provider value={{ user, token, login, register, logout }}>
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
