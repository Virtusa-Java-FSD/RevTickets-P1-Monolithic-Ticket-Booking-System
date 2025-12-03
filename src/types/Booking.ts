import type { Show } from "./Show";

export interface Booking {
  id: string;
  userId: string;
  showId: string;
  show?: Show;
  seats: string[]; // e.g., ["A1", "A2"]
  totalPrice: number;
  bookingDate: string;
  status: "confirmed" | "pending" | "cancelled";
}
