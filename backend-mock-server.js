const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Mock data
let theaters = [
  { id: 1, name: "PVR Cinemas", city: "Mumbai", state: "Maharashtra", location: "Mumbai, Maharashtra", totalScreens: 5, isActive: true },
  { id: 2, name: "INOX", city: "Delhi", state: "Delhi", location: "Delhi, Delhi", totalScreens: 4, isActive: true }
];

let shows = [];
let nextTheaterId = 3;
let nextShowId = 1;

// Theater endpoints
app.get('/api/theaters', (req, res) => {
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