const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const theaters = [
  { id: 1, name: "PVR Cinemas", city: "Mumbai", state: "Maharashtra", totalScreens: 5, isActive: true },
  { id: 2, name: "INOX", city: "Delhi", state: "Delhi", totalScreens: 4, isActive: true }
];

const events = [
  { id: 1, title: "RRR", category: "movie", rating: 8.0, imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba", price: 250 },
  { id: 2, title: "Inception", category: "movie", rating: 8.8, imageUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1", price: 250 }
];

let shows = [];
let nextShowId = 1;

// All endpoints
app.get('/api/theaters', (req, res) => res.json(theaters));
app.get('/api/events', (req, res) => res.json(events));
app.get('/api/admin/stats', (req, res) => res.json({ totalBookings: 0, totalRevenue: 0, totalEvents: 9, totalMovies: 5 }));

app.post('/api/admin/events/:eventId/create-shows', (req, res) => {
  const eventId = parseInt(req.params.eventId);
  shows = shows.filter(s => s.eventId !== eventId);
  
  const times = ["10:00 AM", "2:00 PM", "6:00 PM", "9:30 PM"];
  const today = new Date().toISOString().split('T')[0];
  
  let totalShows = 0;
  theaters.forEach(theater => {
    times.forEach(time => {
      shows.push({
        id: nextShowId++,
        eventId,
        theater: theater.name,
        showTime: time,
        showDate: today,
        price: 250,
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
  res.json(shows.filter(s => s.eventId === eventId));
});

app.listen(8081, () => {
  console.log('Full server running on port 8081');
});