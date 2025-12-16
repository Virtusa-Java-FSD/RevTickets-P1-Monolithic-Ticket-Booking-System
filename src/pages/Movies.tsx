import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Event } from "../types/Event";
import MovieCard from "../components/MovieCard";
import Footer from "../components/Footer";
import AuthModal from "../components/AuthModal";
import "../styles/movies.css";

const Movies = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Event[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("title");
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    loadMovies();
  }, []);

  // Banner carousel effect - change every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % movies.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [movies.length]);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const { getEvents } = await import("../utils/api");
      const allEvents = await getEvents();

      // Filter for movies
      // Assuming 'category' field is 'movie' or similar
      const moviesList = Array.isArray(allEvents)
        ? allEvents.filter((e: any) => e.category === 'movie' || (!e.category && e.title))
        : [];

      setMovies(moviesList);
      setFilteredMovies(moviesList);
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

    // Genre filter
    if (selectedGenre !== "all") {
      result = result.filter((movie) => movie.genre?.includes(selectedGenre));
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

  // Get unique languages and genres
  const languages = Array.from(new Set(movies.map((movie) => movie.language).filter(Boolean))) as string[];
  const genres = Array.from(new Set(movies.flatMap((movie) => movie.genre?.split(',').map(g => g.trim()) || []).filter(Boolean))) as string[];

  const handleAuthRequired = () => {
    setShowAuthModal(true);
  };

  const handleAuthModalLogin = () => {
    setShowAuthModal(false);
    navigate('/login');
  };

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
      <div className="container-fluid p-0">
        {/* Banner Carousel */}
        <div className="banner-carousel">
          {movies.map((movie, index) => (
            <div
              key={movie.id}
              className={`banner-slide ${index === currentBannerIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url(${movie.imageUrl})` }}
            >
              <div className="banner-overlay"></div>
              <div className="banner-content">
                <div className="container">
                  <h2 className="text-white display-5 fw-bold">{movie.title}</h2>
                  <p className="text-white-50">{movie.genre} • {movie.language}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="movies-header py-3" style={{ background: '#1f1f1f', color: 'white' }}>
          <div className="container">
            <h1 className="h4 mb-0 fw-bold">Movies</h1>
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
        <div className="container mt-4 mb-4">
          <div className="row g-2">
            {/* Search */}
            <div className="col-12 col-md-3">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="🔍 Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Language Filter */}
            <div className="col-4 col-md-2">
              <select
                className="form-select form-select-sm"
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

            {/* Genre Filter */}
            <div className="col-4 col-md-2">
              <select
                className="form-select form-select-sm"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                <option value="all">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="col-4 col-md-2">
              <select
                className="form-select form-select-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="title">Title</option>
                <option value="rating">Rating</option>
                <option value="duration">Duration</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="col-12 col-md-3">
              <button
                className="btn btn-outline-secondary btn-sm w-100"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedLanguage("all");
                  setSelectedGenre("all");
                  setSortBy("title");
                }}
              >
                Clear Filters
              </button>
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
              <div className="row g-2">
                {filteredMovies.map((movie) => (
                  <div key={movie.id} style={{ flex: '0 0 20%', maxWidth: '20%', padding: '0 0.25rem' }}>
                    <MovieCard movie={movie} onAuthRequired={handleAuthRequired} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleAuthModalLogin}
      />
      <Footer />
    </div>
  );
};

export default Movies;
