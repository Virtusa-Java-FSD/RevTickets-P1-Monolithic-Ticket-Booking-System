export interface Event {
  id: string;
  title: string;
  description: string;
  category: "movie" | "concert" | "travel" | "other" | "conference" | "business" | "art" | "food" | "wellness" | "gaming" | "environment";
  imageUrl: string;
  rating?: number;
  duration?: number; // in minutes for movies
  releaseDate?: string;
  language?: string;
  eventDate?: string;
  location?: string;
  seats?: number;
  speakers?: number;
  price?: number;
}
