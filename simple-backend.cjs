const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let movies = [
  { id: 1, title: "RRR", rating: 8.0, imageUrl: "https://example.com/rrr.jpg", price: 250, language: "Telugu", genre: "Action", description: "Epic action drama" },
  { id: 2, title: "Inception", rating: 8.8, imageUrl: "https://example.com/inception.jpg", price: 250, language: "English", genre: "Sci-Fi", description: "Mind-bending thriller" }
];

let concerts = [
  { id: 8, title: "Rock Festival", rating: 4.8, imageUrl: "https://example.com/rock.jpg", price: 800, location: "Bangalore", eventDate: "2024-03-01", description: "Amazing rock concert" },
  { id: 9, title: "Jazz Night", rating: 4.6, imageUrl: "https://example.com/jazz.jpg", price: 600, location: "Mumbai", eventDate: "2024-03-05", description: "Smooth jazz evening" }
];

let events = [
  { id: 6, title: "Tech Conference", rating: 4.5, imageUrl: "https://example.com/tech.jpg", price: 500, location: "Mumbai", eventDate: "2024-02-15", description: "Technology conference" },
  { id: 7, title: "Art Exhibition", rating: 4.2, imageUrl: "https://example.com/art.jpg", price: 200, location: "Delhi", eventDate: "2024-02-20", description: "Art showcase" }
];

let theaters = [
  { id: 1, name: "PVR Cinemas", city: "Mumbai", state: "Maharashtra", location: "Mumbai, Maharashtra", totalScreens: 5, isActive: true },
  { id: 2, name: "INOX", city: "Delhi", state: "Delhi", location: "Delhi, Delhi", totalScreens: 4, isActive: true }
];

app.get('/api/movies', (req, res) => res.json(movies));
app.get('/api/concerts', (req, res) => res.json(concerts));
app.get('/api/events', (req, res) => res.json(events));
app.get('/api/theaters', (req, res) => res.json(theaters));

app.get('/api/movies/:id', (req, res) => {
  const movie = movies.find(m => m.id == req.params.id);
  res.json(movie || {});
});

app.get('/api/concerts/:id', (req, res) => {
  const concert = concerts.find(c => c.id == req.params.id);
  res.json(concert || {});
});

app.get('/api/events/:id', (req, res) => {
  const event = events.find(e => e.id == req.params.id);
  res.json(event || {});
});

app.get('/api/shows/event/:eventId', (req, res) => {
  res.json([
    { id: 1, eventId: req.params.eventId, theater: "PVR Cinemas", showTime: "10:00 AM", showDate: "2024-12-20", price: 250, availableSeats: 100, format: "2D" },
    { id: 2, eventId: req.params.eventId, theater: "INOX", showTime: "2:00 PM", showDate: "2024-12-20", price: 250, availableSeats: 100, format: "2D" }
  ]);
});

app.listen(8080, () => {
  console.log('Backend server running on http://localhost:8080');
});