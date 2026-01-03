const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// All your original data
let theaters = [
  { id: 1, name: "PVR Cinemas", city: "Mumbai", state: "Maharashtra", location: "Mumbai, Maharashtra", totalScreens: 5, isActive: true },
  { id: 2, name: "INOX", city: "Delhi", state: "Delhi", location: "Delhi, Delhi", totalScreens: 4, isActive: true }
];

// Separate data structures
let movies = [
  { id: 1, title: "RRR", rating: 8.0, imageUrl: "https://m.media-amazon.com/images/M/MV5BODUwNDNjYzctODUxNy00ZTA2LWIyYTEtMDc5Y2E5ZjBmNTMzXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_.jpg", price: 250, language: "Telugu", genre: "Action, Drama", description: "Epic action drama" },
  { id: 2, title: "Inception", rating: 8.8, imageUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1", price: 250, language: "English", genre: "Sci-Fi, Thriller", description: "Mind-bending thriller" },
  { id: 3, title: "The Dark Knight", rating: 9.0, imageUrl: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9", price: 300, language: "English", genre: "Action, Crime", description: "Batman saga" },
  { id: 4, title: "Pushpa", rating: 7.5, imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728", price: 200, language: "Telugu", genre: "Action, Drama", description: "Action packed" },
  { id: 5, title: "3 Idiots", rating: 8.4, imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1", price: 220, language: "Hindi", genre: "Comedy, Drama", description: "Comedy drama" }
];

let concerts = [
  { id: 8, title: "Rock Festival", rating: 4.8, imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f", price: 800, location: "Bangalore", eventDate: "2024-03-01", description: "Amazing rock concert" },
  { id: 9, title: "Jazz Night", rating: 4.6, imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a", price: 600, location: "Mumbai", eventDate: "2024-03-05", description: "Smooth jazz evening" }
];

let events = [
  { id: 6, title: "Tech Conference 2024", rating: 4.5, imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30", price: 500, location: "Mumbai", eventDate: "2024-02-15", description: "Technology conference", industry: "Tech", seats: 1000 },
  { id: 7, title: "Art Exhibition", rating: 4.2, imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865", price: 200, location: "Delhi", eventDate: "2024-02-20", description: "Art showcase", industry: "Art", seats: 500 },
  { id: 12, title: "Food Festival", rating: 4.6, imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0", price: 150, location: "Bangalore", eventDate: "2024-03-20", description: "Culinary delights", industry: "Food", seats: 800 },
  { id: 13, title: "Book Fair", rating: 4.3, imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570", price: 100, location: "Kolkata", eventDate: "2024-03-25", description: "Literature celebration", industry: "Education", seats: 600 }
];

let users = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "9876543210", role: "USER" },
  { id: 2, name: "Admin User", email: "admin@example.com", phone: "9876543211", role: "ADMIN" }
];

let bookings = [
  { id: 1, user: { id: 1 }, seats: ["A1", "A2"], totalPrice: 500, status: "CONFIRMED", bookingDate: new Date().toISOString() }
];

let travels = [
  { id: 1, type: "Bus", operator: "RedBus", departure: "Mumbai", arrival: "Pune", departureTime: "10:00 AM", price: 500, availableSeats: 30 }
];

let shows = [];
let nextTheaterId = 3;
let nextShowId = 1;
let nextMovieId = 6;
let nextConcertId = 12;
let nextEventId = 14;

// All endpoints with your original data
app.get('/api/theaters', (req, res) => res.json(theaters));
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

// Separate endpoints for each category
app.get('/api/movies', (req, res) => res.json(movies));
app.get('/api/concerts', (req, res) => {
  console.log('Concerts data:', JSON.stringify(concerts, null, 2));
  res.json(concerts);
});
app.get('/api/events', (req, res) => {
  console.log('Events endpoint called, returning:', events.length, 'events');
  console.log('Events data:', events.map(e => ({ id: e.id, title: e.title })));
  res.json(events);
});

// Legacy endpoint for backward compatibility
app.get('/api/all-events', (req, res) => {
  const allEvents = [...movies.map(m => ({...m, category: 'movie'})), ...concerts.map(c => ({...c, category: 'concert'})), ...events.map(e => ({...e, category: 'event'}))];
  res.json(allEvents);
});
app.get('/api/admin/users', (req, res) => res.json(users));
app.get('/api/admin/bookings', (req, res) => res.json(bookings));
app.get('/api/admin/travels', (req, res) => res.json(travels));
app.get('/api/admin/stats', (req, res) => res.json({
  totalBookings: bookings.length,
  totalRevenue: 500,
  totalEvents: events.length,
  totalMovies: movies.length,
  totalConcerts: concerts.length
}));

// Shows with timing - works for movies, concerts, and events
app.post('/api/admin/events/:eventId/create-shows', (req, res) => {
  const eventId = parseInt(req.params.eventId);
  shows = shows.filter(s => s.eventId !== eventId);
  
  // Find the item in movies, concerts, or events
  const item = movies.find(m => m.id === eventId) || concerts.find(c => c.id === eventId) || events.find(e => e.id === eventId);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  const times = ["10:00 AM", "2:00 PM", "6:00 PM", "9:30 PM"];
  const today = new Date().toISOString().split('T')[0];
  
  let totalShows = 0;
  theaters.filter(t => t.isActive).forEach(theater => {
    times.forEach(time => {
      shows.push({
        id: nextShowId++,
        eventId,
        theater: theater.name,
        showTime: time,
        showDate: today,
        price: item.price || 250,
        availableSeats: 100,
        format: "2D"
      });
      totalShows++;
    });
  });
  
  res.json({ totalShows, theaters: theaters.map(t => t.name) });
});

app.get('/api/shows/event/:eventId', (req, res) => {
  const eventId = parseInt(req.params.eventId);
  const eventShows = shows.filter(s => s.eventId === eventId);
  
  // If no shows exist, create default shows
  if (eventShows.length === 0) {
    const item = movies.find(m => m.id === eventId) || concerts.find(c => c.id === eventId) || events.find(e => e.id === eventId);
    if (item) {
      const times = ["10:00 AM", "2:00 PM", "6:00 PM", "9:30 PM"];
      const today = new Date().toISOString().split('T')[0];
      
      theaters.filter(t => t.isActive).forEach(theater => {
        times.forEach(time => {
          shows.push({
            id: nextShowId++,
            eventId,
            theater: theater.name,
            showTime: time,
            showDate: today,
            price: item.price || 250,
            availableSeats: 100,
            format: "2D"
          });
        });
      });
      
      return res.json(shows.filter(s => s.eventId === eventId));
    }
  }
  
  res.json(eventShows);
});

// Individual item endpoints
app.get('/api/movies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const movie = movies.find(m => m.id === id);
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).json({ error: 'Movie not found' });
  }
});

app.get('/api/concerts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const concert = concerts.find(c => c.id === id);
  if (concert) {
    res.json(concert);
  } else {
    res.status(404).json({ error: 'Concert not found' });
  }
});

app.get('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const event = events.find(e => e.id === id);
  if (event) {
    res.json(event);
  } else {
    res.status(404).json({ error: 'Event not found' });
  }
});

// Movie CRUD endpoints
app.post('/api/movies', (req, res) => {
  const movie = { id: nextMovieId++, ...req.body };
  movies.push(movie);
  res.json(movie);
});
app.put('/api/movies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = movies.findIndex(m => m.id === id);
  if (index !== -1) {
    movies[index] = { ...movies[index], ...req.body };
    res.json(movies[index]);
  } else {
    res.status(404).json({ error: 'Movie not found' });
  }
});
app.delete('/api/movies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = movies.findIndex(m => m.id === id);
  if (index !== -1) {
    movies.splice(index, 1);
    res.json({ message: 'Movie deleted' });
  } else {
    res.status(404).json({ error: 'Movie not found' });
  }
});

// Concert CRUD endpoints
app.post('/api/concerts', (req, res) => {
  const concert = { id: nextConcertId++, ...req.body };
  concerts.push(concert);
  res.json(concert);
});
app.put('/api/concerts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = concerts.findIndex(c => c.id === id);
  if (index !== -1) {
    concerts[index] = { ...concerts[index], ...req.body };
    res.json(concerts[index]);
  } else {
    res.status(404).json({ error: 'Concert not found' });
  }
});
app.delete('/api/concerts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = concerts.findIndex(c => c.id === id);
  if (index !== -1) {
    concerts.splice(index, 1);
    res.json({ message: 'Concert deleted' });
  } else {
    res.status(404).json({ error: 'Concert not found' });
  }
});

// Event CRUD endpoints
app.post('/api/events', (req, res) => {
  const event = { id: nextEventId++, ...req.body };
  events.push(event);
  res.json(event);
});
app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = events.findIndex(e => e.id === id);
  if (index !== -1) {
    events[index] = { ...events[index], ...req.body };
    res.json(events[index]);
  } else {
    res.status(404).json({ error: 'Event not found' });
  }
});
app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = events.findIndex(e => e.id === id);
  if (index !== -1) {
    events.splice(index, 1);
    res.json({ message: 'Event deleted' });
  } else {
    res.status(404).json({ error: 'Event not found' });
  }
});

app.listen(8081, () => {
  console.log('Complete server running on port 8081 - Movies, concerts, and events now separated');
});