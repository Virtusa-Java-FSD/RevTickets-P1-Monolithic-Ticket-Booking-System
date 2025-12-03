import type { Event } from "./Event";

export interface Show {
  id: string;
  eventId: string;
  event?: Event;
  showDateTime: string;
  theater?: string;
  format?: string; // 2D, 3D, IMAX, etc.
  language?: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
}
