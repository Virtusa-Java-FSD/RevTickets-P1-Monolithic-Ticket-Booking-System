import type { Event } from "./Event";

export interface Show {
  id: string;
  eventId: string;
  event?: Event;
  showDateTime: string;
  showDate?: string; // Optional: for backward compatibility
  showTime?: string; // Optional: for backward compatibility
  theater?: string;
  format?: string; // 2D, 3D, IMAX, etc.
  language?: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
}
