import { useState, useEffect } from "react";
import type { Event } from "../types/Event";
import MovieCard from "../components/MovieCard";
import "../styles/movies.css";

const Movies = () => {
  const [movies, setMovies] = useState<Event[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("title");

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      // For demo purposes, using mock data
      const mockMovies: Event[] = [
        {
          id: "1",
          title: "Inception",
          description: "A thief who steals corporate secrets through dream-sharing technology.",
          category: "movie",
          imageUrl: "https://picsum.photos/250/350?random=1",
          rating: 8.8,
          duration: 148,
          releaseDate: "2010-07-16",
          language: "English",
        },
        {
          id: "2",
          title: "The Dark Knight",
          description: "When the menace known as the Joker wreaks havoc on Gotham.",
          category: "movie",
          imageUrl: "https://picsum.photos/250/350?random=2",
          rating: 9.0,
          duration: 152,
          releaseDate: "2008-07-18",
          language: "English",
        },
        {
          id: "3",
          title: "Interstellar",
          description: "A team of explorers travel through a wormhole in space.",
          category: "movie",
          imageUrl: "https://picsum.photos/250/350?random=3",
          rating: 8.6,
          duration: 169,
          releaseDate: "2014-11-07",
          language: "English",
        },
        {
          id: "4",
          title: "Pushpa",
          description: "A man rises to power by dealing in red sanders.",
          category: "movie",
          imageUrl: "https://picsum.photos/250/350?random=4",
          rating: 7.5,
          duration: 179,
          releaseDate: "2021-12-17",
          language: "Telugu",
        },
        {
          id: "5",
          title: "3 Idiots",
          description: "Two friends are searching for their long lost companion.",
          category: "movie",
          imageUrl: "https://picsum.photos/250/350?random=5",
          rating: 8.4,
          duration: 170,
          releaseDate: "2009-12-25",
          language: "Hindi",
        },
        {
          id: "6",
          title: "Avatar",
          description: "A paraplegic Marine dispatched to the moon Pandora.",
          category: "movie",
          imageUrl: "https://picsum.photos/250/350?random=6",
          rating: 7.8,
          duration: 162,
          releaseDate: "2009-12-18",
          language: "English",
        },
      ];
      setMovies(mockMovies);
      setFilteredMovies(mockMovies);
      setError(null);
    } catch (err) {
      setError("Failed to load movies. Please try again later.");
      console.error("Error loading movies:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort movies
  useEffect(() => {
    let result = [...movies];

    // Search filter
    if (searchTerm.trim()) {
      result = result.filter(
        (movie) =>
          movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          movie.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Language filter
    if (selectedLanguage !== "all") {
      result = result.filter((movie) => movie.language === selectedLanguage);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "duration":
          return (a.duration || 0) - (b.duration || 0);
        case "title":
        default:
          return a.title.localeCompare(b.title);
      }
    });

    setFilteredMovies(result);
  }, [searchTerm, selectedLanguage, sortBy, movies]);

  // Get unique languages
  const languages = Array.from(new Set(movies.map((movie) => movie.language).filter(Boolean))) as string[];

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="movies-page">
      <div className="container-fluid">
        {/* Header */}
        <div className="movies-header py-5 bg-dark text-white">
          <div className="container">
            <h1 className="display-4 mb-2">🎬 Movies</h1>
            <p className="lead">Book your favorite movies now!</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show m-4" role="alert">
            {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError(null)}
            ></button>
          </div>
        )}

        {/* Filters */}
        <div className="container mt-4 mb-5">
          <div className="row g-2 g-sm-3">
            {/* Search */}
            <div className="col-12 col-sm-6 col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="🔍 Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Language Filter */}
            <div className="col-6 col-sm-3 col-md-4">
              <select
                className="form-select"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                <option value="all">All Languages</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="col-6 col-sm-3 col-md-4">
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="title">Sort by Title</option>
                <option value="rating">Sort by Rating (High to Low)</option>
                <option value="duration">Sort by Duration</option>
              </select>
            </div>
          </div>
        </div>

        {/* Movies Grid */}
        <div className="container mb-5">
          {filteredMovies.length === 0 ? (
            <div className="alert alert-info text-center py-5">
              <p className="mb-0">No movies found. Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <p className="text-muted mb-4">
                Showing <strong>{filteredMovies.length}</strong> movie{filteredMovies.length !== 1 ? "s" : ""}
              </p>
              <div className="row g-2 g-sm-3 g-md-4">
                {filteredMovies.map((movie) => (
                  <div key={movie.id} className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-2">
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Movies;
