import { Flight, Bus, Train, Seat, BusLayout } from '../types/Travel';

// Mock data generators
export const generateFlights = (from: string, to: string, date: string): Flight[] => {
  const airlines = [
    { name: 'IndiGo', code: '6E', logo: '6E' },
    { name: 'SpiceJet', code: 'SG', logo: 'SG' },
    { name: 'Air India', code: 'AI', logo: 'AI' },
    { name: 'Vistara', code: 'UK', logo: 'UK' },
    { name: 'GoAir', code: 'G8', logo: 'G8' }
  ];

  const aircraft = ['Airbus A320', 'Boeing 737', 'ATR 72', 'Airbus A321'];
  
  return Array.from({ length: 8 }, (_, i) => {
    const airline = airlines[i % airlines.length];
    const departureHour = 6 + (i * 2);
    const duration = 2 + Math.floor(Math.random() * 4);
    const arrivalHour = departureHour + duration;
    
    return {
      id: `flight-${i}`,
      airline: airline.name,
      flightNumber: `${airline.code}-${1000 + i}`,
      aircraft: aircraft[i % aircraft.length],
      departure: {
        time: `${departureHour.toString().padStart(2, '0')}:${(i * 15) % 60}`,
        airport: from,
        code: from.substring(0, 3).toUpperCase()
      },
      arrival: {
        time: `${arrivalHour.toString().padStart(2, '0')}:${((i * 15) + 30) % 60}`,
        airport: to,
        code: to.substring(0, 3).toUpperCase()
      },
      duration: `${duration}h ${30 + (i * 10)}m`,
      price: 4500 + (i * 500) + Math.floor(Math.random() * 1000),
      stops: i % 3 === 0 ? 1 : 0
    };
  });
};

export const generateBuses = (from: string, to: string, date: string): Bus[] => {
  const operators = [
    'VRL Travels', 'SRS Travels', 'Orange Travels', 'RedBus', 'Kallada Travels',
    'KPN Travels', 'Parveen Travels', 'Raj National Express', 'Neeta Travels'
  ];
  
  const busTypes = ['AC Sleeper', 'AC Semi Sleeper', 'Non-AC Seater', 'Volvo AC', 'Multi-Axle'];
  const amenities = ['WiFi', 'Charging Point', 'Entertainment', 'Blanket', 'Water Bottle', 'Snacks'];
  
  return Array.from({ length: 12 }, (_, i) => {
    const departureHour = 18 + (i * 2) % 24;
    const duration = 8 + Math.floor(Math.random() * 6);
    const arrivalHour = (departureHour + duration) % 24;
    
    return {
      id: `bus-${i}`,
      operator: operators[i % operators.length],
      busType: busTypes[i % busTypes.length],
      departure: {
        time: `${departureHour.toString().padStart(2, '0')}:00`,
        location: from
      },
      arrival: {
        time: `${arrivalHour.toString().padStart(2, '0')}:30`,
        location: to
      },
      duration: `${duration}h 30m`,
      price: 800 + (i * 200) + Math.floor(Math.random() * 500),
      rating: 3.5 + (Math.random() * 1.5),
      amenities: amenities.slice(0, 3 + Math.floor(Math.random() * 3)),
      availableSeats: 45 - Math.floor(Math.random() * 20)
    };
  });
};

export const generateTrains = (from: string, to: string, date: string): Train[] => {
  const trains = [
    { name: 'Rajdhani Express', number: '12001' },
    { name: 'Shatabdi Express', number: '12002' },
    { name: 'Duronto Express', number: '12259' },
    { name: 'Garib Rath', number: '12611' },
    { name: 'Jan Shatabdi', number: '12023' },
    { name: 'Superfast Express', number: '12625' }
  ];
  
  return Array.from({ length: 6 }, (_, i) => {
    const train = trains[i];
    const departureHour = 8 + (i * 3);
    const duration = 12 + Math.floor(Math.random() * 8);
    const arrivalHour = (departureHour + duration) % 24;
    
    return {
      id: `train-${i}`,
      name: train.name,
      number: train.number,
      departure: {
        time: `${departureHour.toString().padStart(2, '0')}:${(i * 15) % 60}`,
        station: from,
        code: from.substring(0, 4).toUpperCase()
      },
      arrival: {
        time: `${arrivalHour.toString().padStart(2, '0')}:${((i * 15) + 30) % 60}`,
        station: to,
        code: to.substring(0, 4).toUpperCase()
      },
      duration: `${duration}h ${30 + (i * 10)}m`,
      classes: [
        {
          name: 'Sleeper',
          code: 'SL',
          price: 450 + (i * 50),
          availability: i % 3 === 0 ? 'available' : 'rac',
          availableSeats: i % 3 === 0 ? 25 : undefined
        },
        {
          name: 'AC 3 Tier',
          code: '3A',
          price: 1200 + (i * 100),
          availability: i % 2 === 0 ? 'rac' : 'waitlist',
          waitlistCount: i % 2 === 0 ? undefined : 15
        },
        {
          name: 'AC 2 Tier',
          code: '2A',
          price: 2200 + (i * 150),
          availability: 'waitlist',
          waitlistCount: 25
        }
      ]
    };
  });
};

export const generateBusLayout = (): BusLayout => {
  const generateDeckSeats = (deck: 'lower' | 'upper', rows: number): Seat[] => {
    const seats: Seat[] = [];
    
    for (let row = 1; row <= rows; row++) {
      // Left side seats (A, B)
      seats.push({
        id: `${deck}-${row}A`,
        row,
        number: `${row}A`,
        status: Math.random() > 0.7 ? 'booked' : 'available',
        deck,
        price: 1200
      });
      seats.push({
        id: `${deck}-${row}B`,
        row,
        number: `${row}B`,
        status: Math.random() > 0.8 ? 'booked' : 'available',
        deck,
        price: 1200
      });
      
      // Right side seats (C, D)
      seats.push({
        id: `${deck}-${row}C`,
        row,
        number: `${row}C`,
        status: Math.random() > 0.8 ? 'booked' : 'available',
        deck,
        price: 1200
      });
      seats.push({
        id: `${deck}-${row}D`,
        row,
        number: `${row}D`,
        status: Math.random() > 0.7 ? 'booked' : 'available',
        deck,
        price: 1200
      });
    }
    
    return seats;
  };
  
  const lowerDeck = generateDeckSeats('lower', 12);
  const upperDeck = generateDeckSeats('upper', 10);
  const totalSeats = lowerDeck.length + upperDeck.length;
  const availableSeats = [...lowerDeck, ...upperDeck].filter(seat => seat.status === 'available').length;
  
  return {
    lowerDeck,
    upperDeck,
    totalSeats,
    availableSeats
  };
};

// Utility functions
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(price);
};

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const calculateTravelTime = (departure: string, arrival: string): string => {
  const [depHour, depMin] = departure.split(':').map(Number);
  const [arrHour, arrMin] = arrival.split(':').map(Number);
  
  let totalMinutes = (arrHour * 60 + arrMin) - (depHour * 60 + depMin);
  if (totalMinutes < 0) totalMinutes += 24 * 60; // Next day arrival
  
  return formatDuration(totalMinutes);
};

export const getAvailabilityColor = (availability: string): string => {
  switch (availability) {
    case 'available':
    case 'CNF':
      return '#28a745';
    case 'rac':
    case 'RAC':
      return '#ffc107';
    case 'waitlist':
    case 'WL':
      return '#dc3545';
    default:
      return '#6c757d';
  }
};

export const sortFlights = (flights: Flight[], sortBy: string): Flight[] => {
  const sorted = [...flights];
  
  switch (sortBy) {
    case 'price':
      return sorted.sort((a, b) => a.price - b.price);
    case 'duration':
      return sorted.sort((a, b) => {
        const aDuration = parseInt(a.duration.split('h')[0]) * 60 + parseInt(a.duration.split('h')[1]);
        const bDuration = parseInt(b.duration.split('h')[0]) * 60 + parseInt(b.duration.split('h')[1]);
        return aDuration - bDuration;
      });
    case 'departure':
      return sorted.sort((a, b) => a.departure.time.localeCompare(b.departure.time));
    default:
      return sorted;
  }
};

export const filterBuses = (buses: Bus[], filters: any): Bus[] => {
  return buses.filter(bus => {
    if (filters.busType && !filters.busType.includes(bus.busType)) return false;
    if (filters.minRating && bus.rating < filters.minRating) return false;
    if (filters.maxPrice && bus.price > filters.maxPrice) return false;
    if (filters.amenities && !filters.amenities.every((amenity: string) => bus.amenities.includes(amenity))) return false;
    return true;
  });
};