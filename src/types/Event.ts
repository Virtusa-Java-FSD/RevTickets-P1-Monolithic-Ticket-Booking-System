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
}
