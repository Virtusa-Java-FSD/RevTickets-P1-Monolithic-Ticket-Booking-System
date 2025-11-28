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
	register: (name: string, email: string, password: string) => Promise<void>;
	logout: () => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

const STORAGE_KEY = "rev_auth";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);

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
		}
	}, []);

	const persist = (tok: string | null, usr: User | null) => {
		setToken(tok);
		setUser(usr);
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: tok, user: usr }));
	};

	const login = async (email: string, password: string) => {
		const data = await loginRequest({ email, password });
		// expecting { token, user }
		persist(data.token, data.user || null);
	};

	const register = async (name: string, email: string, password: string) => {
		const data = await registerRequest({ name, email, password });
		// some APIs return token on register
		if (data.token) persist(data.token, data.user || null);
	};

	const logout = () => {
		persist(null, null);
		localStorage.removeItem(STORAGE_KEY);
	};

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
