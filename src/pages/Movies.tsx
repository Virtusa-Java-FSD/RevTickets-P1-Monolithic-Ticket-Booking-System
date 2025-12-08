import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Event } from "../types/Event";
import MovieCard from "../components/MovieCard";
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
  const [selectedFormat, setSelectedFormat] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const bannerImages = [
    "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX1000_.jpg",
    "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_FMjpg_UX1000_.jpg",
    "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg",
    "https://m.media-amazon.com/images/M/MV5BY2JmZTNhNGEtZGVlZS00ZjI3LWEzZjYtMGQ2NWZiYjI5OWU4XkEyXkFqcGdeQXVyMTEzMTI1Mjk3._V1_FMjpg_UX1000_.jpg",
    "https://m.media-amazon.com/images/M/MV5BODUwNDNjYzctODUxNy00ZTA2LWIyYTEtMDc5Y2E5ZjBmNTMzXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_FMjpg_UX1000_.jpg",
  ];

  useEffect(() => {
    loadMovies();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [bannerImages.length]);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const mockMovies: Event[] = [
        {
          id: "1",
          title: "Inception",
          description: "A thief who steals corporate secrets through dream-sharing technology.",
          category: "movie",
          imageUrl: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX1000_.jpg",
          rating: 8.8,
          duration: 148,
          releaseDate: "2010-07-16",
          language: "English",
          genre: "Action, Sci-Fi",
          format: "2D, 3D, IMAX",
          price: 350,
          location: "PVR Cinemas",
          isNewRelease: false,
        },
        {
          id: "2",
          title: "The Dark Knight",
          description: "When the menace known as the Joker wreaks havoc on Gotham.",
          category: "movie",
          imageUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_FMjpg_UX1000_.jpg",
          rating: 9.0,
          duration: 152,
          releaseDate: "2008-07-18",
          language: "English",
          genre: "Action, Crime",
          format: "2D, IMAX",
          price: 300,
          location: "INOX",
          isNewRelease: false,
        },
        {
          id: "3",
          title: "Interstellar",
          description: "A team of explorers travel through a wormhole in space.",
          category: "movie",
          imageUrl: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg",
          rating: 8.6,
          duration: 169,
          releaseDate: "2014-11-07",
          language: "English",
          genre: "Sci-Fi, Drama",
          format: "2D, IMAX",
          price: 320,
          location: "Cinepolis",
          isNewRelease: false,
        },
        {
          id: "4",
          title: "Pushpa",
          description: "A man rises to power by dealing in red sanders.",
          category: "movie",
          imageUrl: "https://m.media-amazon.com/images/M/MV5BY2JmZTNhNGEtZGVlZS00ZjI3LWEzZjYtMGQ2NWZiYjI5OWU4XkEyXkFqcGdeQXVyMTEzMTI1Mjk3._V1_FMjpg_UX1000_.jpg",
          rating: 7.5,
          duration: 179,
          releaseDate: "2021-12-17",
          language: "Telugu",
          genre: "Action, Drama",
          format: "2D",
          price: 180,
          location: "Carnival",
          isNewRelease: true,
        },
        {
          id: "5",
          title: "3 Idiots",
          description: "Two friends are searching for their long lost companion.",
          category: "movie",
          imageUrl: "https://m.media-amazon.com/images/M/MV5BNTkyOGVjMGEtNmQzZi00NzFlLTlhOWQtODYyMDc2ZGJmYzFhXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_FMjpg_UX1000_.jpg",
          rating: 8.4,
          duration: 170,
          releaseDate: "2009-12-25",
          language: "Hindi",
          genre: "Comedy, Drama",
          format: "2D",
          price: 200,
          location: "PVR",
          isNewRelease: false,
        },
        {
          id: "6",
          title: "Avatar",
          description: "A paraplegic Marine dispatched to the moon Pandora.",
          category: "movie",
          imageUrl: "https://m.media-amazon.com/images/M/MV5BZDA0OGQxNTItMDZkMC00N2UyLTg3MzMtYTJmNjg3Nzk5MzRiXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_FMjpg_UX1000_.jpg",
          rating: 7.8,
          duration: 162,
          releaseDate: "2009-12-18",
          language: "English",
          genre: "Action, Adventure",
          format: "2D, 3D, IMAX",
          price: 400,
          location: "IMAX Theatre",
          isNewRelease: false,
        },
        {
          id: "7",
          title: "RRR",
          description: "A fictional story about two legendary revolutionaries.",
          category: "movie",
          imageUrl: "https://m.media-amazon.com/images/M/MV5BODUwNDNjYzctODUxNy00ZTA2LWIyYTEtMDc5Y2E5ZjBmNTMzXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_FMjpg_UX1000_.jpg",
          rating: 8.0,
          duration: 187,
          releaseDate: "2022-03-25",
          language: "Telugu",
          genre: "Action, Drama",
          format: "2D, 3D",
          price: 250,
          location: "Cinepolis",
          isNewRelease: true,
        },
        {
          id: "8",
          title: "Dangal",
          description: "Former wrestler Mahavir Singh Phogat trains his daughters.",
          category: "movie",
          imageUrl: "https://m.media-amazon.com/images/M/MV5BMTQ4MzQzMzM2Nl5BMl5BanBnXkFtZTgwMTQ1NzU3MDI@._V1_FMjpg_UX1000_.jpg",
          rating: 8.3,
          duration: 161,
          releaseDate: "2016-12-23",
          language: "Hindi",
          genre: "Biography, Drama",
          format: "2D",
          price: 190,
          location: "PVR",
          isNewRelease: false,
        },
        {
          id: "9",
          title: "Baahubali 2",
          description: "When Shiva, the son of Bahubali, learns about his heritage.",
          category: "movie",
          imageUrl: "https://m.media-amazon.com/images/M/MV5BYTljYjllZTQtMzNmZC00YzJiLWI0MjQtZGRhYjEyNDZkMzY2XkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_FMjpg_UX1000_.jpg",
          rating: 8.2,
          duration: 167,
          releaseDate: "2017-04-28",
          language: "Telugu",
          genre: "Action, Drama",
          format: "2D, IMAX",
          price: 220,
          location: "PVR",
          isNewRelease: false,
        },
        {
          id: "10",
          title: "KGF Chapter 2",
          description: "The blood-soaked land of Kolar Gold Fields has a new overlord.",
          category: "movie",
          imageUrl: "https://m.media-amazon.com/images/M/MV5BMTEzNGE1NzYtYWY5Ni00YzJjLWJlZTQtNzBiYTI1ZjkzNGMwXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_FMjpg_UX1000_.jpg",
          rating: 8.4,
          duration: 168,
          releaseDate: "2022-04-14",
          language: "Kannada",
          genre: "Action, Crime",
          format: "2D, 3D",
          price: 280,
          location: "INOX",
          isNewRelease: true,
        },
        {
          id: "11",
          title: "Avengers Endgame",
          description: "After the devastating events, the Avengers assemble once more.",
          category: "movie",
          imageUrl: "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_FMjpg_UX1000_.jpg",
          rating: 8.4,
          duration: 181,
          releaseDate: "2019-04-26",
          language: "English",
          genre: "Action, Adventure",
          format: "2D, 3D, IMAX",
          price: 380,
          location: "IMAX Theatre",
          isNewRelease: false,
        },
        {
          id: "12",
          title: "Pathaan",
          description: "An Indian spy takes on the leader of a group of mercenaries.",
          category: "movie",
          imageUrl: "https://m.media-amazon.com/images/M/MV5BM2QzM2JiNTMtYjU0Yy00YWIzLWJkYWEtYzRhMGFiNDU1NzZmXkEyXkFqcGdeQXVyMTUzNTgzNzM0._V1_FMjpg_UX1000_.jpg",
          rating: 7.8,
          duration: 146,
          releaseDate: "2023-01-25",
          language: "Hindi",
          genre: "Action, Thriller",
          format: "2D, IMAX",
          price: 260,
          location: "PVR",
          isNewRelease: true,
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

  useEffect(() => {
    let result = [...movies];

    if (searchTerm.trim()) {
      result = result.filter(
        (movie) =>
          movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          movie.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLanguage !== "all") {
      result = result.filter((movie) => movie.language === selectedLanguage);
    }

    if (selectedGenre !== "all") {
      result = result.filter((movie) => movie.genre?.toLowerCase().includes(selectedGenre.toLowerCase()));
    }

    if (selectedFormat !== "all") {
      result = result.filter((movie) => movie.format?.toLowerCase().includes(selectedFormat.toLowerCase()));
    }

    if (priceRange !== "all") {
      result = result.filter((movie) => {
        const price = movie.price || 0;
        switch (priceRange) {
          case "low": return price < 200;
          case "medium": return price >= 200 && price < 300;
          case "high": return price >= 300;
          default: return true;
        }
      });
    }

    result.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    setFilteredMovies(result);
  }, [searchTerm, selectedLanguage, selectedGenre, selectedFormat, priceRange, movies]);

  const languages = Array.from(new Set(movies.map((movie) => movie.language).filter(Boolean))) as string[];
  const genres = Array.from(new Set(movies.flatMap((movie) => movie.genre?.split(',').map(g => g.trim()) || []).filter(Boolean))) as string[];
  const formats = Array.from(new Set(movies.flatMap((movie) => movie.format?.split(',').map(f => f.trim()) || []).filter(Boolean))) as string[];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted small">Loading movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="movies-page">
      <div className="banner-carousel">
        {bannerImages.map((img, index) => (
          <div
            key={index}
            className={`banner-slide ${index === currentBannerIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${img})` }}
          >
            <div className="banner-overlay"></div>
          </div>
        ))}
        <div className="banner-content">
          <div className="container-fluid px-3">
            <h2 className="text-white mb-1 fw-bold fs-4 fs-md-3">🎬 Movies</h2>
            <p className="text-white mb-0 small">Book tickets for the latest blockbusters</p>
            <span className="badge bg-white text-dark px-3 py-2 mt-2 small">
              {filteredMovies.length} Movies
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="container-fluid px-3 pt-2">
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError(null)}></button>
          </div>
        </div>
      )}

      <div className="container-fluid px-3 py-2 py-md-3">
        <div className="row g-2">
          <div className="col-12 col-md-3 mb-2 mb-md-0">
            <div className="input-group input-group-sm">
              <span className="input-group-text">🔍</span>
              <input
                type="text"
                className="form-control"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-6 col-md-2">
            <select
              className="form-select form-select-sm"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="all">Languages</option>
              {languages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
          <div className="col-6 col-md-2">
            <select
              className="form-select form-select-sm"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              <option value="all">Genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
          <div className="col-6 col-md-2">
            <select
              className="form-select form-select-sm"
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
            >
              <option value="all">Format</option>
              {formats.map((format) => (
                <option key={format} value={format}>{format}</option>
              ))}
            </select>
          </div>
          <div className="col-6 col-md-2">
            <select
              className="form-select form-select-sm"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
            >
              <option value="all">Price Range</option>
              <option value="low">Under ₹200</option>
              <option value="medium">₹200 - ₹300</option>
              <option value="high">Above ₹300</option>
            </select>
          </div>
          {(selectedLanguage !== "all" || selectedGenre !== "all" || selectedFormat !== "all" || priceRange !== "all") && (
            <div className="col-12 col-md-1">
              <button
                className="btn btn-sm btn-outline-danger w-100"
                onClick={() => {
                  setSelectedLanguage("all");
                  setSelectedGenre("all");
                  setSelectedFormat("all");
                  setPriceRange("all");
                }}
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="container-fluid px-3 pb-3">
        {filteredMovies.length === 0 ? (
          <div className="text-center py-4">
            <div className="alert alert-info d-inline-block">
              No movies found. Try adjusting your filters.
            </div>
          </div>
        ) : (
          <div className="row g-2 g-md-3">
            {filteredMovies.map((movie) => (
              <div key={movie.id} className="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                <MovieCard 
                  movie={movie}
                  onDetailClick={() => navigate(`/movie/${movie.id}`)}
                  onBookClick={() => navigate(`/movie/${movie.id}`)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-light py-4">
        <div className="container-fluid px-3">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center">
              <h5 className="mb-3">🎟️ Book Your Movie Tickets</h5>
              <p className="text-muted mb-2">Experience the magic of cinema with the best seats and prices</p>
              <div className="d-flex justify-content-center align-items-center gap-3 flex-wrap">
                <span className="fw-bold text-primary">📱 +1 (555) 123-4567</span>
                <span className="text-muted d-none d-sm-inline">|</span>
                <span className="fw-bold text-primary">📧 movies@revtickets.com</span>
              </div>
              <small className="text-muted d-block mt-2">Available 24/7 for customer support</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movies;
