import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "";

const client = axios.create({
	baseURL,
	headers: { "Content-Type": "application/json" },
});

export const loginRequest = async (payload: { email: string; password: string }) => {
	const resp = await client.post("/auth/login", payload);
	return resp.data;
};

export const registerRequest = async (payload: { name: string; email: string; password: string }) => {
	const resp = await client.post("/auth/register", payload);
	return resp.data;
};

export default client;
