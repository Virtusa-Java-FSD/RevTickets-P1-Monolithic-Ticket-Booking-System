import client from "./api";
import type { Event } from "../types/Event";
import type { Show } from "../types/Show";

// Fetch all movies
export const fetchMovies = async (): Promise<Event[]> => {
  try {
    const response = await client.get("/movies");
    return response.data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};

// Fetch a single movie by ID
export const fetchMovieById = async (movieId: string): Promise<Event> => {
  try {
    const response = await client.get(`/movies/${movieId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie:", error);
    throw error;
  }
};

// Fetch shows for a movie
export const fetchShowsByMovieId = async (movieId: string): Promise<Show[]> => {
  try {
    const response = await client.get(`/movies/${movieId}/shows`);
    return response.data;
  } catch (error) {
    console.error("Error fetching shows:", error);
    throw error;
  }
};

// Search movies
export const searchMovies = async (query: string): Promise<Event[]> => {
  try {
    const response = await client.get("/movies/search", { params: { q: query } });
    return response.data;
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
};

// Filter movies by language or rating
export const filterMovies = async (filters: { language?: string; minRating?: number }): Promise<Event[]> => {
  try {
    const response = await client.get("/movies/filter", { params: filters });
    return response.data;
  } catch (error) {
    console.error("Error filtering movies:", error);
    throw error;
  }
};
