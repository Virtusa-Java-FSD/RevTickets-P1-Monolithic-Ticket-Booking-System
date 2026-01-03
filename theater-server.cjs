const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Only theaters - everything else stays as your original backend
let theaters = [
  { id: 1, name: "PVR Cinemas", city: "Mumbai", state: "Maharashtra", location: "Mumbai, Maharashtra", totalScreens: 5, isActive: true },
  { id: 2, name: "INOX", city: "Delhi", state: "Delhi", location: "Delhi, Delhi", totalScreens: 4, isActive: true }
];

let nextTheaterId = 3;

// ONLY theater endpoints - nothing else changed
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

// Forward all other requests to your original backend
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Use your original backend for other endpoints' });
});

app.listen(8080, () => {
  console.log('Theater server running on port 8080 - ONLY theaters endpoint added');
});