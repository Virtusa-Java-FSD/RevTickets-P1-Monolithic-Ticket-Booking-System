export interface SearchData {
  from: string;
  to: string;
  date: string;
  passengers: string;
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  aircraft: string;
  departure: {
    time: string;
    airport: string;
    code: string;
  };
  arrival: {
    time: string;
    airport: string;
    code: string;
  };
  duration: string;
  price: number;
  stops: number;
}

export interface Bus {
  id: string;
  operator: string;
  busType: string;
  departure: {
    time: string;
    location: string;
  };
  arrival: {
    time: string;
    location: string;
  };
  duration: string;
  price: number;
  rating: number;
  amenities: string[];
  availableSeats: number;
}

export interface Train {
  id: string;
  name: string;
  number: string;
  departure: {
    time: string;
    station: string;
    code: string;
  };
  arrival: {
    time: string;
    station: string;
    code: string;
  };
  duration: string;
  classes: TrainClass[];
}

export interface TrainClass {
  name: string;
  code: string;
  price: number;
  availability: 'available' | 'rac' | 'waitlist';
  availableSeats?: number;
  waitlistCount?: number;
}

export interface Seat {
  id: string;
  row: number;
  number: string;
  status: 'available' | 'booked' | 'selected';
  deck: 'lower' | 'upper';
  price?: number;
}

export interface BusLayout {
  lowerDeck: Seat[];
  upperDeck: Seat[];
  totalSeats: number;
  availableSeats: number;
}

export interface BookingDetails {
  type: 'flight' | 'bus' | 'train';
  searchData: SearchData;
  selectedItem: Flight | Bus | Train;
  selectedSeats?: Seat[];
  passengers: PassengerDetails[];
  totalAmount: number;
}

export interface PassengerDetails {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  seatNumber?: string;
}

export interface TravelFilter {
  priceRange: [number, number];
  departureTime: string[];
  amenities: string[];
  rating: number;
  busType?: string[];
  trainClass?: string[];
  stops?: number;
}