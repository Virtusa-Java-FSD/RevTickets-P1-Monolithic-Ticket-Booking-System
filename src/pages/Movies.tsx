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
      // For demo purposes, using mock data
      const mockMovies: Event[] = [
        {
          id: "1",
          title: "Inception",
          description: "A thief who steals corporate secrets through dream-sharing technology.",
          category: "movie",
          genre: "Sci-Fi, Thriller",
          imageUrl: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
          rating: 8.8,
          duration: 148,
          releaseDate: "2010-07-16",
          language: "English",
          price: 250,
        },
        {
          id: "2",
          title: "The Dark Knight",
          description: "When the menace known as the Joker wreaks havoc on Gotham.",
          category: "movie",
          genre: "Action, Crime",
          imageUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
          rating: 9.0,
          duration: 152,
          releaseDate: "2008-07-18",
          language: "English",
          price: 300,
        },
        {
          id: "3",
          title: "Interstellar",
          description: "A team of explorers travel through a wormhole in space.",
          category: "movie",
          genre: "Sci-Fi, Drama",
          imageUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
          rating: 8.6,
          duration: 169,
          releaseDate: "2014-11-07",
          language: "English",
          price: 280,
        },
        {
          id: "4",
          title: "Pushpa",
          description: "A man rises to power by dealing in red sanders.",
          category: "movie",
          genre: "Action, Drama",
          imageUrl: "https://image.tmdb.org/t/p/w500/vVpEOvdxVBP2aV166j5Xlvb5Cdc.jpg",
          rating: 7.5,
          duration: 179,
          releaseDate: "2021-12-17",
          language: "Telugu",
          price: 200,
        },
        {
          id: "5",
          title: "3 Idiots",
          description: "Two friends are searching for their long lost companion.",
          category: "movie",
          genre: "Comedy, Drama",
          imageUrl: "https://image.tmdb.org/t/p/w500/66A9MqXOyVFCssoloscw79z8U0Y.jpg",
          rating: 8.4,
          duration: 170,
          releaseDate: "2009-12-25",
          language: "Hindi",
          price: 220,
        },
        {
          id: "6",
          title: "Avatar",
          description: "A paraplegic Marine dispatched to the moon Pandora.",
          category: "movie",
          genre: "Sci-Fi, Adventure",
          imageUrl: "https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg",
          rating: 7.8,
          duration: 162,
          releaseDate: "2009-12-18",
          language: "English",
          price: 350,
        },
        {
          id: "7",
          title: "RRR",
          description: "A fictional story about two revolutionaries.",
          category: "movie",
          genre: "Action, Drama",
          imageUrl: "https://image.tmdb.org/t/p/w500/wR0PIlQGKXRhS0JQUZlVsFf7IL6.jpg",
          rating: 8.0,
          duration: 187,
          releaseDate: "2022-03-25",
          language: "Telugu",
          price: 250,
        },
        {
          id: "8",
          title: "Dangal",
          description: "A former wrestler trains his daughters to become champions.",
          category: "movie",
          genre: "Biography, Drama",
          imageUrl: "https://image.tmdb.org/t/p/w500/9suZQO8DwRyDUWB1fVIuKOHzoDz.jpg",
          rating: 8.3,
          duration: 161,
          releaseDate: "2016-12-23",
          language: "Hindi",
          price: 200,
        },
        {
          id: "9",
          title: "Avengers: Endgame",
          description: "The Avengers assemble once more to reverse Thanos' actions.",
          category: "movie",
          genre: "Action, Adventure",
          imageUrl: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
          rating: 8.4,
          duration: 181,
          releaseDate: "2019-04-26",
          language: "English",
          price: 400,
        },
        {
          id: "10",
          title: "Baahubali 2",
          description: "Amarendra Baahubali fights for the throne.",
          category: "movie",
          genre: "Action, Drama",
          imageUrl: "https://image.tmdb.org/t/p/w500/w2nENOEUxW1MMTyEb6LfL3mEZpV.jpg",
          rating: 8.2,
          duration: 167,
          releaseDate: "2017-04-28",
          language: "Telugu",
          price: 230,
        },
        {
          id: "11",
          title: "The Shawshank Redemption",
          description: "Two imprisoned men bond over years.",
          category: "movie",
          genre: "Drama",
          imageUrl: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
          rating: 9.3,
          duration: 142,
          releaseDate: "1994-09-23",
          language: "English",
          price: 180,
        },
        {
          id: "12",
          title: "KGF Chapter 2",
          description: "Rocky continues his reign as the king of the gold mines.",
          category: "movie",
          genre: "Action, Drama",
          imageUrl: "https://image.tmdb.org/t/p/w500/8y4AwlbY8FGQMNh1bz8u9OqkIG5.jpg",
          rating: 8.4,
          duration: 168,
          releaseDate: "2022-04-14",
          language: "Kannada",
          price: 250,
        },
        {
          id: "13",
          title: "Titanic",
          description: "A seventeen-year-old aristocrat falls in love with a kind but poor artist.",
          category: "movie",
          genre: "Romance, Drama",
          imageUrl: "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
          rating: 7.9,
          duration: 194,
          releaseDate: "1997-12-19",
          language: "English",
          price: 200,
        },
        {
          id: "14",
          title: "Pathaan",
          description: "An Indian spy takes on the leader of a group of mercenaries.",
          category: "movie",
          genre: "Action, Thriller",
          imageUrl: "https://image.tmdb.org/t/p/w500/qmJGd5IfURq8iPQ9KF3les47vFS.jpg",
          rating: 7.8,
          duration: 146,
          releaseDate: "2023-01-25",
          language: "Hindi",
          price: 300,
        },
        {
          id: "15",
          title: "Jawan",
          description: "A high-octane action thriller which outlines the emotional journey of a man.",
          category: "movie",
          genre: "Action, Thriller",
          imageUrl: "https://image.tmdb.org/t/p/w500/uV6ej1JsYbjJP4kkLT6RSFLbRQe.jpg",
          rating: 7.2,
          duration: 169,
          releaseDate: "2023-09-07",
          language: "Hindi",
          price: 320,
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
