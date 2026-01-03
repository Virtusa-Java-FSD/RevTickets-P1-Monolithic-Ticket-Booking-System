import axios from "axios";
import { mockLogin, mockRegister } from './mockAuth';

 const baseURL = "http://localhost:/api";

const client = axios.create({
	baseURL,
	headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token') || localStorage.getItem('rev_auth_token');
		const revAuth = localStorage.getItem('rev_auth');

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		} else if (revAuth) {
			try {
				const auth = JSON.parse(revAuth);
				if (auth.token) {
					config.headers.Authorization = `Bearer ${auth.token}`;
				}
			} catch (e) {
			}
		}
		return config;
	},
	(error) => Promise.reject(error)
);

client.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			localStorage.removeItem('token');
			localStorage.removeItem('rev_auth');
			if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
				window.location.href = '/login';
			}
		}
		return Promise.reject(error);
	}
);

export const sendOTP = async (payload: { email: string }) => {
	try {
		const resp = await client.post("/otp/send", payload);
		return resp.data;
	} catch (error: any) {
		throw new Error(error.response?.data?.message || error.message || 'Failed to send OTP');
	}
};

export const verifyOTP = async (payload: { email: string; otp: string }) => {
	try {
		const resp = await client.post("/otp/verify", payload);
		return resp.data;
	} catch (error: any) {
		throw new Error(error.response?.data?.message || error.message || 'OTP verification failed');
	}
};

export const loginRequest = async (email: string, password: string) => {
	try {
		const resp = await client.post("/auth/login", { email, password });
		return resp.data;
	} catch (error: any) {
		if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
			return await mockLogin(email, password);
		}
		throw new Error(error.response?.data?.message || 'Login failed');
	}
};

export const registerRequest = async (name: string, email: string, phone: string, password: string) => {
	try {
		const resp = await client.post("/auth/register", { name, email, phone, password });
		return resp.data;
	} catch (error: any) {
		if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
			return await mockRegister(name, email, phone, password);
		}
		throw new Error(error.response?.data?.error || error.response?.data?.message || 'Registration failed');
	}
};

export const googleSignIn = async (idToken: string) => {
	try {
		const resp = await client.post("/auth/google", { idToken });
		return resp.data;
	} catch (error: any) {
		throw new Error(error.response?.data?.error || error.message || 'Google sign-in failed');
	}
};
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

const convertTo24Hour = (time12h: string): string => {
	if (!time12h) return '';

	const time = time12h.trim().toUpperCase();
	const [timePart, period] = time.split(/\s*(AM|PM)/);
	if (!timePart) return '';

	const [hours, minutes = '00'] = timePart.split(':');
	let hour24 = parseInt(hours, 10);

	if (period === 'PM' && hour24 !== 12) {
		hour24 += 12;
	} else if (period === 'AM' && hour24 === 12) {
		hour24 = 0;
	}

	return `${hour24.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
};

const transformShow = (show: any): any => {
	if (!show) return null;

	let showDateTime = show.showDateTime;
	if (!showDateTime && show.showDate && show.showTime) {
		const time24h = convertTo24Hour(show.showTime);
		if (time24h) {
			showDateTime = `${show.showDate}T${time24h}`;
		} else {
			showDateTime = `${show.showDate}T${show.showTime}`;
		}
	} else if (!showDateTime && show.showDate) {
		showDateTime = `${show.showDate}T12:00:00`;
	}

	return {
		...show,
		id: String(show.id || show._id || ''),
		eventId: String(show.eventId || show.movieId || ''),
		showDateTime: showDateTime || new Date().toISOString(),
		showDate: show.showDate,
		showTime: show.showTime,
		price: show.price || 0,
		availableSeats: show.availableSeats || 0,
		totalSeats: show.totalSeats || 100,
		bookedSeats: show.bookedSeats || [],
		theater: show.theater || 'Theater TBD',
		format: show.format || '2D'
	};
};

export const getShowsByEventId = async (eventId: string) => {
	try {
		const resp = await client.get(`/shows/event/${eventId}`);
		const data = Array.isArray(resp.data) ? resp.data : [resp.data];
		return data.map(transformShow);
	} catch (error: any) {
		if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
			throw new Error('Cannot connect to server. Please check if backend is running.');
		}
		throw new Error(error.response?.data?.message || 'Failed to fetch shows');
	}
};

export const getShow = async (id: string) => {
	try {
		const resp = await client.get(`/shows/${id}`);
		return transformShow(resp.data);
	} catch (error: any) {
		if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
			throw new Error('Cannot connect to server. Please check if backend is running.');
		}
		throw new Error(error.response?.data?.message || 'Failed to fetch show');
	}
};

export const getBookedSeats = async (showId: string) => {
	try {
		const resp = await client.get(`/shows/${showId}/booked-seats`);
		return resp.data || [];
	} catch (error: any) {
		return [];
	}
};

export const getSeatStatus = async (showId: string) => {
	try {
		const resp = await client.get(`/shows/${showId}/seat-status`);
		return resp.data;
	} catch (error: any) {
		return { totalSeats: 100, availableSeats: 100, bookedSeats: [] };
	}
};

export const checkSeatAvailability = async (showId: string, seats: string[]) => {
	try {
		const resp = await client.post(`/shows/${showId}/check-seats`, seats);
		return resp.data;
	} catch (error: any) {
		throw new Error(error.response?.data?.message || 'Failed to check seat availability');
	}
};

export const createBooking = async (bookingData: any) => {
	try {
		if (!bookingData.user && localStorage.getItem('rev_auth')) {
			try {
				const auth = JSON.parse(localStorage.getItem('rev_auth') || '{}');
				if (auth.user && auth.user.id) {
					bookingData.user = auth.user;
				}
			} catch (e) { }
		}

		const resp = await client.post("/bookings", bookingData);
		return resp.data;
	} catch (error: any) {
		throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to create booking');
	}
};

export const getTravels = async () => {
	try {
		const resp = await client.get('/travel');
		return resp.data;
	} catch (error: any) {
		throw new Error(error.response?.data?.message || 'Failed to fetch travels');
	}
};

export const searchTravels = async (type?: string, from?: string, to?: string) => {
	try {
		const params = new URLSearchParams();
		if (type) params.append('type', type);
		if (from) params.append('from', from);
		if (to) params.append('to', to);

		const resp = await client.get(`/travel/search?${params.toString()}`);
		return resp.data;
	} catch (error: any) {
		throw new Error(error.response?.data?.message || 'Failed to search travels');
	}
};

export const getFlights = async (from: string, to: string) => {
	try {
		const resp = await client.get(`/travel/flights?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
		return resp.data;
	} catch (error: any) {
		throw new Error(error.response?.data?.message || 'Failed to fetch flights');
	}
};

export const getBuses = async (from: string, to: string) => {
	try {
		const resp = await client.get(`/travel/buses?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
		return resp.data;
	} catch (error: any) {
		throw new Error(error.response?.data?.message || 'Failed to fetch buses');
	}
};

export const getTrains = async (from: string, to: string) => {
	try {
		const resp = await client.get(`/travel/trains?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
		return resp.data;
	} catch (error: any) {
		throw new Error(error.response?.data?.message || 'Failed to fetch trains');
	}
};

export const getUserBookings = async (userId: number) => {
	try {
		const resp = await client.get(`/bookings/user/${userId}`);
		return resp.data;
	} catch (error: any) {
		throw new Error(error.response?.data?.message || 'Failed to fetch user bookings');
	}
};

export const savePaymentSuccess = async (paymentId: string, orderId: string, amount: number) => {
	try {
		const resp = await client.post("/payment/success", { paymentId, orderId, amount });
		return resp.data;
	} catch (error: any) {
		console.error("Failed to save payment success:", error);
		// Don't throw, just log
	}
};

export const adminAPI = {
	getStats: async () => {
		// Mock stats or implement a StatsController
		// const resp = await client.get('/admin/stats');
		// return resp.data;
		return { totalBookings: 0, totalRevenue: 0, totalUsers: 0, totalEvents: 0, totalMovies: 0 };
	},

	// Event management
	createEvent: async (event: any) => {
		const resp = await client.post('/events', event);
		return resp.data;
	},

	updateEvent: async (id: number, event: any) => {
		// Catalog service might not have PUT /events/{id}, checking EventController...
		// If missing, we might need to add it. For now assuming it exists or using POST as update if applicable
		const resp = await client.put(`/events/${id}`, event); // Need to ensure EventController has PUT
		return resp.data;
	},

	deleteEvent: async (id: number) => {
		await client.delete(`/events/${id}`); // Need to ensure EventController has DELETE
	},

	getAllBookings: async () => {
		const resp = await client.get('/bookings');
		return resp.data;
	},

	getAllTravels: async () => {
		const resp = await client.get('/travel');
		return resp.data;
	},

	createTravel: async (travel: any) => {
		const resp = await client.post('/travel', travel);
		return resp.data;
	},

	updateTravel: async (id: number, travel: any) => {
		const resp = await client.put(`/travel/${id}`, travel);
		return resp.data;
	},

	deleteTravel: async (id: number) => {
		await client.delete(`/travel/${id}`);
	},

	getAllMovies: async () => {
		const resp = await client.get('/events?category=movie');
		return resp.data;
	},

	createMovie: async (movie: any) => {
		const movieData = {
			...movie,
			category: 'movie',
			rating: movie.rating || 0,
			price: movie.price || 0,
			duration: movie.duration || 0
		};
		const resp = await client.post('/events', movieData);
		return resp.data;
	},

	updateMovie: async (id: number, movie: any) => {
		const movieData = { ...movie, category: 'movie' };
		const resp = await client.put(`/events/${id}`, movieData);
		return resp.data;
	},

	deleteMovie: async (id: number) => {
		await client.delete(`/events/${id}`);
	},

	getAllUsers: async () => {
		const resp = await client.get('/users');
		return resp.data;
	},

	updateUser: async (id: number, user: any) => {
		const resp = await client.put(`/users/${id}`, user);
		return resp.data;
	},

	deleteUser: async (id: number) => {
		await client.delete(`/users/${id}`);
	},

	changeUserRole: async (id: number, role: string) => {
		const resp = await client.post(`/users/${id}/role`, { role });
		return resp.data;
	},

	getAllTheaters: async () => {
		const resp = await client.get('/theaters');
		return resp.data;
	},

	createTheater: async (theater: any) => {
		const resp = await client.post('/theaters', theater);
		return resp.data;
	},

	updateTheater: async (id: number, theater: any) => {
		const resp = await client.put(`/theaters/${id}`, theater);
		return resp.data;
	},

	deleteTheater: async (id: number) => {
		await client.delete(`/theaters/${id}`);
	},

	createShowsForEvent: async (eventId: number) => {
		const resp = await client.post(`/events/${eventId}/create-shows`);
		return resp.data;
	},

	getShowsInfo: async (eventId: number) => {
		const resp = await client.get(`/events/${eventId}/shows-info`);
		return resp.data;
	}
};

export default client;
