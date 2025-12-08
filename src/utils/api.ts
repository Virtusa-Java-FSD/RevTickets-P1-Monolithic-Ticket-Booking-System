import axios from "axios";
import { mockLogin, mockRegister } from './mockAuth';

const baseURL = "http://localhost:8081/api";
const USE_MOCK_AUTH = false; // Set to false when backend is available

const client = axios.create({
	baseURL,
	headers: { "Content-Type": "application/json" },
});

// Add request interceptor for authentication
client.interceptors.request.use(
	(config) => {
		console.log('Making request to:', config.baseURL + config.url);
		console.log('Request headers:', config.headers);
		console.log('Request data:', config.data);
		
		const token = localStorage.getItem('token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Add response interceptor for error handling
client.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			localStorage.removeItem('token');
			window.location.href = '/login';
		}
		return Promise.reject(error);
	}
);

// OTP endpoints
export const sendOTP = async (payload: { email: string }) => {
	if (USE_MOCK_AUTH) {
		console.log('Using mock OTP send');
		await new Promise(resolve => setTimeout(resolve, 1000));
		return { success: true, message: 'OTP sent successfully' };
	}
	
	try {
		console.log('Sending OTP request to:', `${baseURL}/otp/send`);
		console.log('Request payload:', payload);
		
		const resp = await client.post("/otp/send", payload);
		console.log('OTP response:', resp.data);
		return resp.data;
	} catch (error: any) {
		console.error('OTP send error:', error);
		console.error('Error response:', error.response?.data);
		console.error('Error status:', error.response?.status);
		throw new Error(error.response?.data?.message || error.message || 'Failed to send OTP');
	}
};

export const verifyOTP = async (payload: { email: string; otp: string }) => {
	if (USE_MOCK_AUTH) {
		console.log('Using mock OTP verify');
		await new Promise(resolve => setTimeout(resolve, 1000));
		return { success: true, message: 'OTP verified successfully' };
	}
	
	try {
		console.log('Verifying OTP request to:', `${baseURL}/otp/verify`);
		console.log('Request payload:', payload);
		
		const resp = await client.post("/otp/verify", payload);
		console.log('OTP verify response:', resp.data);
		return resp.data;
	} catch (error: any) {
		console.error('OTP verify error:', error);
		console.error('Error response:', error.response?.data);
		console.error('Error status:', error.response?.status);
		throw new Error(error.response?.data?.message || error.message || 'OTP verification failed');
	}
};

// Auth endpoints
export const loginRequest = async (payload: { email: string; password: string }) => {
	if (USE_MOCK_AUTH) {
		console.log('Using mock authentication');
		return await mockLogin(payload.email, payload.password);
	}
	
	try {
		console.log('Login request to:', `${baseURL}/auth/login`);
		console.log('Login payload:', payload);
		
		const resp = await client.post("/auth/login", payload);
		console.log('Login response:', resp.data);
		console.log('Login status:', resp.status);
		return resp.data;
	} catch (error: any) {
		console.error('Login error:', error);
		console.error('Login error response:', error.response?.data);
		console.error('Login error status:', error.response?.status);
		throw new Error(error.response?.data?.message || 'Login failed');
	}
};

export const registerRequest = async (payload: { name: string; email: string; phone: string; password: string }) => {
	if (USE_MOCK_AUTH) {
		console.log('Using mock registration');
		return await mockRegister(payload.name, payload.email, payload.phone, payload.password);
	}
	
	try {
		console.log('Registration request to:', `${baseURL}/auth/register`);
		console.log('Registration payload:', payload);
		
		const resp = await client.post("/auth/register", payload);
		console.log('Registration response:', resp.data);
		console.log('Registration status:', resp.status);
		return resp.data;
	} catch (error: any) {
		console.error('Registration error:', error);
		console.error('Registration error response:', error.response?.data);
		console.error('Registration error status:', error.response?.status);
		throw new Error(error.response?.data?.error || error.response?.data?.message || 'Registration failed');
	}
};

// Events endpoints
export const getEvents = async () => {
	try {
		const resp = await client.get("/events");
		return resp.data;
	} catch (error: any) {
		throw new Error(error.response?.data?.message || 'Failed to fetch events');
	}
};

export const getEvent = async (id: string) => {
	try {
		const resp = await client.get(`/events/${id}`);
		return resp.data;
	} catch (error: any) {
		throw new Error(error.response?.data?.message || 'Failed to fetch event');
	}
};

export const createEvent = async (eventData: any) => {
	try {
		const resp = await client.post("/events", eventData);
		return resp.data;
	} catch (error: any) {
		throw new Error(error.response?.data?.message || 'Failed to create event');
	}
};

export default client;
