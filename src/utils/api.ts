import axios from "axios";
import { mockLogin, mockRegister } from './mockAuth';

const baseURL = "http://localhost:8081/api";

const client = axios.create({
	baseURL,
	headers: { "Content-Type": "application/json" },
});

// Add request interceptor for authentication
client.interceptors.request.use(
	(config) => {
		console.log('Making request to:', (config.baseURL || '') + (config.url || ''));
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
export const loginRequest = async (email: string, password: string) => {
	try {
		const resp = await client.post("/auth/login", { email, password });
		return resp.data;
	} catch (error: any) {
		throw new Error(error.response?.data?.message || 'Login failed');
	}
};

export const registerRequest = async (name: string, email: string, phone: string, password: string) => {
	try {
		const resp = await client.post("/auth/register", { name, email, phone, password });
		return resp.data;
	} catch (error: any) {
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

export const getShowsByEventId = async (eventId: string) => {
	try {
		const resp = await client.get(`/shows/event/${eventId}`);
		return resp.data;
	} catch (error: any) {
		throw new Error(error.response?.data?.message || 'Failed to fetch shows');
	}
};

// Booking endpoints
export const createBooking = async (bookingData: any) => {
	try {
		// Automatically attach user ID if not present and available in auth
		if (!bookingData.user && localStorage.getItem('rev_auth')) {
			try {
				const auth = JSON.parse(localStorage.getItem('rev_auth') || '{}');
				if (auth.user && auth.user.id) {
					bookingData.user = auth.user;
					// Note: Backend might expect 'user' object or 'userId'. 
					// Looking at Booking.java: @DBRef private User user; 
					// Spring Data REST often handles object refs, but custom controllers might expect ID.
					// Let's assume the controller can handle the object or ID if logic is standard.
					// But wait, Controller says: bookingService.createBooking(booking).
					// Ideally we pass the ID or the object. Let's pass the object as standard JSON.
				}
			} catch (e) { /* ignore */ }
		}

		const resp = await client.post("/bookings", bookingData);
		return resp.data;
	} catch (error: any) {
		throw new Error(error.response?.data?.message || 'Failed to create booking');
	}
};

// Get all travels (for user booking page)
export const getTravels = async () => {
	try {
		const resp = await client.get('/travel');
		return resp.data;
	} catch (error: any) {
		throw new Error(error.response?.data?.message || 'Failed to fetch travels');
	}
};

// Get user bookings
export const getUserBookings = async (userId: number) => {
	try {
		const resp = await client.get(`/bookings/user/${userId}`);
		return resp.data;
	} catch (error: any) {
		throw new Error(error.response?.data?.message || 'Failed to fetch user bookings');
	}
};

// Admin API functions
export const adminAPI = {
	// Get dashboard stats
	getStats: async () => {
		const resp = await client.get('/admin/stats');
		return resp.data;
	},

	// Event management
	createEvent: async (event: any) => {
		const resp = await client.post('/admin/events', event);
		return resp.data;
	},

	updateEvent: async (id: number, event: any) => {
		const resp = await client.put(`/admin/events/${id}`, event);
		return resp.data;
	},

	deleteEvent: async (id: number) => {
		await client.delete(`/admin/events/${id}`);
	},

	// Get all bookings
	getAllBookings: async () => {
		const resp = await client.get('/admin/bookings');
		return resp.data;
	},

	// Travel management
	getAllTravels: async () => {
		const resp = await client.get('/admin/travels');
		return resp.data;
	},

	createTravel: async (travel: any) => {
		const resp = await client.post('/admin/travels', travel);
		return resp.data;
	},

	updateTravel: async (id: number, travel: any) => {
		const resp = await client.put(`/admin/travels/${id}`, travel);
		return resp.data;
	},

	deleteTravel: async (id: number) => {
		await client.delete(`/admin/travels/${id}`);
	}
};

export default client;
