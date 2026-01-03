const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Mock data
let theaters = [
  { id: 1, name: "PVR Cinemas", city: "Mumbai", state: "Maharashtra", location: "Mumbai, Maharashtra", totalScreens: 5, isActive: true },
  { id: 2, name: "INOX", city: "Delhi", state: "Delhi", location: "Delhi, Delhi", totalScreens: 4, isActive: true },
  { id: 3, name: "Cinepolis", city: "Bangalore", state: "Karnataka", location: "Bangalore, Karnataka", totalScreens: 6, isActive: true }
];

console.log('Server starting with theaters:', theaters.length);

let shows = [];
let nextTheaterId = 4;
let nextShowId = 1;

// Theater endpoints
app.get('/api/theaters', (req, res) => {
  console.log('GET /api/theaters called, returning:', theaters);
  res.json(theaters);
});

app.post('/api/theaters', (req, res) => {
  const theater = { id: nextTheaterId++, ...req.body, isActive: true };
  theaters.push(theater);
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

// Shows endpoints
app.post('/api/admin/events/:eventId/create-shows', (req, res) => {
  const eventId = parseInt(req.params.eventId);
  
  // Delete existing shows for this event
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
  
  res.json({
    totalShows,
    theaters: activeTheaters.map(t => t.name)
  });
});

app.get('/api/shows/event/:eventId', (req, res) => {
  const eventId = parseInt(req.params.eventId);
  const eventShows = shows.filter(s => s.eventId === eventId);
  res.json(eventShows);
});

app.get('/api/admin/events/:eventId/shows-info', (req, res) => {
  const eventId = parseInt(req.params.eventId);
  const eventShows = shows.filter(s => s.eventId === eventId);
  const theatersInShows = [...new Set(eventShows.map(s => s.theater))];
  const allActiveTheaters = theaters.filter(t => t.isActive).map(t => t.name);
  
  res.json({
    eventTitle: `Event ${eventId}`,
    totalShows: eventShows.length,
    theatersInShows,
    allActiveTheaters
  });
});

// Helper function
function convertTo24Hour(time12h) {
  const [time, period] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  hours = parseInt(hours);
  
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  
  return `${hours.toString().padStart(2, '0')}:${minutes}:00`;
}

// Events endpoint (needed for your frontend)
app.get('/api/events', (req, res) => {
  const events = [
    { id: 1, title: "RRR", category: "movie", rating: 8.0, imageUrl: "https://m.media-amazon.com/images/M/MV5BODUwNDNjYzctODUxNy00ZTA2LWIyYTEtMDc5Y2E5ZjBmNTMzXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_.jpg", price: 250, language: "Telugu", genre: "Action, Drama" },
    { id: 2, title: "Inception", category: "movie", rating: 8.8, imageUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1", price: 250, language: "English", genre: "Sci-Fi, Thriller" },
    { id: 3, title: "The Dark Knight", category: "movie", rating: 9.0, imageUrl: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9", price: 300, language: "English", genre: "Action, Crime" },
    { id: 4, title: "Pushpa", category: "movie", rating: 7.5, imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728", price: 200, language: "Telugu", genre: "Action, Drama" },
    { id: 5, title: "3 Idiots", category: "movie", rating: 8.4, imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1", price: 220, language: "Hindi", genre: "Comedy, Drama" }
  ];
  res.json(events);
});

// Admin stats
app.get('/api/admin/stats', (req, res) => {
  res.json({
    totalBookings: 0,
    totalRevenue: 0,
    totalEvents: 9,
    totalMovies: 5
  });
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
});