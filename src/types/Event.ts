export interface Event {
  id: string;
  title: string;
  description: string;
  category: "movie" | "concert" | "travel" | "other";
  imageUrl: string;
  rating?: number;
  duration?: number; // in minutes for movies
  releaseDate?: string;
  language?: string;
  genre?: string;
  genres?: string[]; // for multi-genre support
  format?: string;
  price?: number;
  location?: string;
  eventDate?: string;
  seats?: number;
  speakers?: number;
  isNewRelease?: boolean;
  showtimes?: string[];
  reviewCount?: number;
  seatsAvailable?: number;
  industry?: string;
}
