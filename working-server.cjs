const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Mock data - exactly what you need
let theaters = [
  { id: 1, name: "PVR Cinemas", city: "Mumbai", state: "Maharashtra", location: "Mumbai, Maharashtra", totalScreens: 5, isActive: true },
  { id: 2, name: "INOX", city: "Delhi", state: "Delhi", location: "Delhi, Delhi", totalScreens: 4, isActive: true },
  { id: 3, name: "Cinepolis", city: "Bangalore", state: "Karnataka", location: "Bangalore, Karnataka", totalScreens: 6, isActive: true }
];

const events = [
  { id: 1, title: "RRR", category: "movie", rating: 8.0, imageUrl: "https://m.media-amazon.com/images/M/MV5BODUwNDNjYzctODUxNy00ZTA2LWIyYTEtMDc5Y2E5ZjBmNTMzXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_.jpg", price: 250, language: "Telugu", genre: "Action, Drama" },
  { id: 2, title: "Inception", category: "movie", rating: 8.8, imageUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1", price: 250, language: "English", genre: "Sci-Fi, Thriller" },
  { id: 3, title: "The Dark Knight", category: "movie", rating: 9.0, imageUrl: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9", price: 300, language: "English", genre: "Action, Crime" },
  { id: 4, title: "Pushpa", category: "movie", rating: 7.5, imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728", price: 200, language: "Telugu", genre: "Action, Drama" },
  { id: 5, title: "3 Idiots", category: "movie", rating: 8.4, imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1", price: 220, language: "Hindi", genre: "Comedy, Drama" }
];

let shows = [];
let nextTheaterId = 4;
let nextShowId = 1;

console.log('Starting server with:', theaters.length, 'theaters and', events.length, 'events');

// All your endpoints
app.get('/api/theaters', (req, res) => {
  console.log('GET /api/theaters - returning', theaters.length, 'theaters');
  res.json(theaters);
});

app.post('/api/theaters', (req, res) => {
  const theater = { id: nextTheaterId++, ...req.body, isActive: true };
  theaters.push(theater);
  console.log('Added theater:', theater.name);
  res.json(theater);
});

app.put('/api/theaters/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = theaters.findIndex(t => t.id === id);
  if (index !== -1) {
    theaters[index] = { ...theaters[index], ...req.body };
    res.json(theaters[index]);
  } else {
    res.status(404).json({ error: 'Theater not found' });
  }
});

app.delete('/api/theaters/:id', (req, res) => {
  const id = parseInt(req.params.id);
  theaters = theaters.filter(t => t.id !== id);
  res.json({ message: 'Theater deleted' });
});

app.get('/api/events', (req, res) => {
  console.log('GET /api/events - returning', events.length, 'events');
  res.json(events);
});

// Users endpoint
app.get('/api/admin/users', (req, res) => {
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", phone: "9876543210", role: "USER" },
    { id: 2, name: "Admin User", email: "admin@example.com", phone: "9876543211", role: "ADMIN" }
  ];
  res.json(users);
});

// Bookings endpoint
app.get('/api/admin/bookings', (req, res) => {
  const bookings = [
    { id: 1, user: { id: 1 }, seats: ["A1", "A2"], totalPrice: 500, status: "CONFIRMED", bookingDate: new Date().toISOString() }
  ];
  res.json(bookings);
});

// Travel endpoint
app.get('/api/admin/travels', (req, res) => {
  const travels = [
    { id: 1, type: "Bus", operator: "RedBus", departure: "Mumbai", arrival: "Pune", departureTime: "10:00 AM", price: 500, availableSeats: 30 }
  ];
  res.json(travels);
});

app.get('/api/admin/stats', (req, res) => {
  res.json({
    totalBookings: 1,
    totalRevenue: 500,
    totalEvents: events.length,
    totalMovies: events.filter(e => e.category === 'movie').length
  });
});

app.post('/api/admin/events/:eventId/create-shows', (req, res) => {
  const eventId = parseInt(req.params.eventId);
  console.log('Creating shows for event:', eventId);
  
  shows = shows.filter(s => s.eventId !== eventId);
  
  const times = ["10:00 AM", "2:00 PM", "6:00 PM", "9:30 PM"];
  const today = new Date().toISOString().split('T')[0];
  
  let totalShows = 0;
  const activeTheaters = theaters.filter(t => t.isActive);
  
  activeTheaters.forEach(theater => {
    times.forEach(time => {
      const show = {
        id: nextShowId++,
        eventId: eventId,
        theaterId: theater.id,
        theater: theater.name,
        showTime: time,
        showDate: today,
        showDateTime: `${today}T${convertTo24Hour(time)}`,
        price: 250,
        availableSeats: 100,
        totalSeats: 100,
        format: "2D"
      };
      shows.push(show);
      totalShows++;
    });
  });
  
  console.log('Created', totalShows, 'shows for', activeTheaters.length, 'theaters');
  res.json({
    totalShows,
    theaters: activeTheaters.map(t => t.name)
  });
});

app.get('/api/shows/event/:eventId', (req, res) => {
  const eventId = parseInt(req.params.eventId);
  const eventShows = shows.filter(s => s.eventId === eventId);
  console.log('GET shows for event', eventId, '- returning', eventShows.length, 'shows');
  res.json(eventShows);
});

app.get('/api/admin/events/:eventId/shows-info', (req, res) => {
  const eventId = parseInt(req.params.eventId);
  const eventShows = shows.filter(s => s.eventId === eventId);
  const theatersInShows = [...new Set(eventShows.map(s => s.theater))];
  const allActiveTheaters = theaters.filter(t => t.isActive).map(t => t.name);
  
  res.json({
    eventTitle: events.find(e => e.id === eventId)?.title || `Event ${eventId}`,
    totalShows: eventShows.length,
    theatersInShows,
    allActiveTheaters
  });
});

function convertTo24Hour(time12h) {
  const [time, period] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  hours = parseInt(hours);
  
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  
  return `${hours.toString().padStart(2, '0')}:${minutes}:00`;
}

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Test theaters: http://localhost:${PORT}/api/theaters`);
  console.log(`✅ Test events: http://localhost:${PORT}/api/events`);
});