import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Event } from "../types/Event";
import type { Show } from "../types/Show";
import "../styles/movieDetail.css";

const MovieDetail = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Event | null>(null);
  const [shows, setShows] = useState<Show[]>([]);
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>("");

  useEffect(() => {
    loadMovieDetails();
  }, [movieId]);

  const loadMovieDetails = async () => {
    try {
      setLoading(true);
      const mockMovie: Event = {
        id: movieId || "1",
        title: "Inception",
        description: "A skilled thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.",
        category: "movie",
        imageUrl: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX1000_.jpg",
        rating: 8.8,
        duration: 148,
        releaseDate: "2010-07-16",
        language: "English",
        genre: "Action, Sci-Fi, Thriller",
        format: "2D, 3D, IMAX",
      };

      const mockShows: Show[] = [
        {
          id: "s1",
          eventId: movieId || "1",
          showDateTime: new Date(Date.now() + 86400000).toISOString(),
          theater: "PVR Cinemas",
          format: "IMAX 3D",
          language: "English",
          price: 350,
          availableSeats: 45,
          totalSeats: 100,
        },
        {
          id: "s2",
          eventId: movieId || "1",
          showDateTime: new Date(Date.now() + 86400000).toISOString(),
          theater: "INOX Megaplex",
          format: "2D",
          language: "English",
          price: 200,
          availableSeats: 60,
          totalSeats: 100,
        },
        {
          id: "s3",
          eventId: movieId || "1",
          showDateTime: new Date(Date.now() + 172800000).toISOString(),
          theater: "Cinepolis",
          format: "3D",
          language: "English",
          price: 280,
          availableSeats: 30,
          totalSeats: 80,
        },
      ];

      setMovie(mockMovie);
      setShows(mockShows);
      
      const dates = Array.from(new Set(mockShows.map(s => new Date(s.showDateTime).toDateString())));
      if (dates.length > 0) {
        setSelectedDate(dates[0]);
      }
    } catch (error) {
      console.error("Error loading movie details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowSelection = (show: Show) => {
    setSelectedShow(show);
    navigate(`/booking/${show.id}`);
  };

  const getAvailableDates = () => {
    const dates = Array.from(new Set(shows.map(s => new Date(s.showDateTime).toDateString())));
    return dates.map(dateStr => new Date(dateStr));
  };

  const getShowsForDate = (dateStr: string) => {
    return shows.filter(show => new Date(show.showDateTime).toDateString() === dateStr);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading movie details...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">Movie not found</div>
      </div>
    );
  }

  const availableDates = getAvailableDates();
  const filteredShows = selectedDate ? getShowsForDate(selectedDate) : shows;

  return (
    <div className="movie-detail-page">
      <div className="movie-header" style={{ backgroundImage: `url(${movie.imageUrl})` }}>
        <div className="header-overlay"></div>
        <div className="container">
          <button className="back-btn" onClick={() => navigate("/movies")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
          <div className="header-content">
            <div className="movie-poster-large">
              <img src={movie.imageUrl} alt={movie.title} />
            </div>
            <div className="movie-details">
              <h1 className="movie-title-large">{movie.title}</h1>
              <div className="movie-badges">
                {movie.rating && (
                  <span className="badge rating-badge-large">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#fbbf24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    {movie.rating}/10
                  </span>
                )}
                {movie.language && <span className="badge">{movie.language}</span>}
                {movie.duration && <span className="badge">{movie.duration} mins</span>}
              </div>
              {movie.genre && (
                <div className="movie-genre">{movie.genre}</div>
              )}
              <p className="movie-description-large">{movie.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="showtimes-section">
        <div className="container">
          <h2 className="section-title">Select Date & Time</h2>
          
          <div className="date-selector">
            {availableDates.map((date, index) => (
              <button
                key={index}
                className={`date-btn ${selectedDate === date.toDateString() ? 'active' : ''}`}
                onClick={() => setSelectedDate(date.toDateString())}
              >
                <div className="date-day">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div className="date-number">{date.getDate()}</div>
                <div className="date-month">{date.toLocaleDateString('en-US', { month: 'short' })}</div>
              </button>
            ))}
          </div>

          {filteredShows.length === 0 ? (
            <div className="no-shows">
              <p>No shows available for this date</p>
            </div>
          ) : (
            <div className="theaters-list">
              {filteredShows.map((show) => (
                <div key={show.id} className="theater-card">
                  <div className="theater-info">
                    <h3 className="theater-name">{show.theater}</h3>
                    <div className="theater-meta">
                      <span className="format-tag">{show.format}</span>
                      <span className="seats-info">
                        {show.availableSeats > 0 ? (
                          <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            {show.availableSeats} seats available
                          </>
                        ) : (
                          <span className="sold-out">SOLD OUT</span>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="showtime-info">
                    <div className="showtime">
                      {new Date(show.showDateTime).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </div>
                    <div className="price">₹{show.price}</div>
                    <button
                      className="select-btn"
                      onClick={() => handleShowSelection(show)}
                      disabled={show.availableSeats === 0}
                    >
                      {show.availableSeats > 0 ? 'Select' : 'Full'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
