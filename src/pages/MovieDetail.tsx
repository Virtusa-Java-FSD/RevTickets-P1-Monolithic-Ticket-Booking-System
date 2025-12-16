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

  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [customDate, setCustomDate] = useState<string>("");
  const [customTime, setCustomTime] = useState<string>("");
  const [showCustomBooking, setShowCustomBooking] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string>("All");

  useEffect(() => {
    loadMovieDetails();
  }, [movieId]);

  const loadMovieDetails = async () => {
    try {
      setLoading(true);
      if (!movieId) return;

      const { getEvent, getShowsByEventId } = await import("../utils/api");

      // Fetch movie (event) details
      const eventData = await getEvent(movieId);
      setMovie(eventData);

      // Fetch shows
      const showsData = await getShowsByEventId(movieId) as Show[];
      // Ensure date format is correct for sorting/display
      setShows(showsData);

      const dates = Array.from(new Set(showsData.map((s: Show) => new Date(s.showDateTime).toDateString())));
      if (dates.length > 0) {
        setSelectedDate(dates[0] as string);
      }
    } catch (error) {
      console.error("Error loading movie details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowSelection = (show: Show) => {
    navigate(`/seat-selection/${show.id}`);
  };

  const handleCustomBooking = () => {
    if (!customDate || !customTime) {
      alert("Please select both date and time");
      return;
    }
    const customShow: Show = {
      id: `custom-${Date.now()}`,
      eventId: movieId || "1",
      showDateTime: `${customDate}T${customTime}`,
      theater: "Custom Booking",
      format: movie?.format?.split(',')[0]?.trim() || "2D",
      language: movie?.language || "English",
      price: movie?.price || 250,
      availableSeats: 80,
      totalSeats: 100,
    };
    navigate(`/seat-selection/${customShow.id}`);
  };

  const getAvailableDates = () => {
    const dates = Array.from(new Set(shows.map(s => new Date(s.showDateTime).toDateString())));
    return dates.map(dateStr => new Date(dateStr));
  };

  const getShowsForDate = (dateStr: string) => {
    let filtered = shows.filter(show => new Date(show.showDateTime).toDateString() === dateStr);
    if (selectedFormat !== "All") {
      filtered = filtered.filter(show => show.format === selectedFormat);
    }
    return filtered;
  };

  const getAvailableFormats = () => {
    const formats = new Set(shows.map(s => s.format));
    return ["All", ...Array.from(formats)];
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
      <div className="movie-header" style={{
        backgroundImage: `url(${movie.imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="header-overlay"></div>
        <div className="container">
          <button className="back-btn" onClick={() => navigate("/movies")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
          <div className="header-content">
            <div className="movie-poster-large">
              <img
                src={movie.imageUrl}
                alt={movie.title}
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop';
                }}
              />
            </div>
            <div className="movie-details">
              <h1 className="movie-title-large">{movie.title}</h1>
              <div className="movie-badges">
                {movie.rating && (
                  <span className="badge rating-badge-large">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#fbbf24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
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

              {/* Additional Info */}
              <div className="additional-info">
                <div className="info-item">
                  <span className="info-label">Release Date:</span>
                  <span className="info-value">{new Date(movie.releaseDate || '').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Available Formats:</span>
                  <span className="info-value">{movie.format}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="showtimes-section">
        <div className="container">
          <h2 className="section-title">Select Date & Time</h2>

          <div className="booking-controls">
            <div className="custom-booking-toggle">
              <button
                className={`toggle-btn ${!showCustomBooking ? 'active' : ''}`}
                onClick={() => setShowCustomBooking(false)}
              >
                Available Shows
              </button>
              <button
                className={`toggle-btn ${showCustomBooking ? 'active' : ''}`}
                onClick={() => setShowCustomBooking(true)}
              >
                Custom Booking
              </button>
            </div>

            {!showCustomBooking && (
              <div className="format-filter">
                {getAvailableFormats().map((format) => (
                  <button
                    key={format}
                    className={`format-filter-btn ${selectedFormat === format ? 'active' : ''}`}
                    onClick={() => setSelectedFormat(format || '')}
                  >
                    {format}
                  </button>
                ))}
              </div>
            )}
          </div>

          {showCustomBooking ? (
            <div className="custom-booking-section">
              <div className="custom-booking-card">
                <h3>Select Date & Time</h3>
                <div className="custom-inputs">
                  <div className="input-group">
                    <label>Date</label>
                    <input
                      type="date"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="input-group">
                    <label>Time</label>
                    <input
                      type="time"
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                    />
                  </div>
                </div>
                <button className="custom-book-btn" onClick={handleCustomBooking}>
                  Continue
                </button>
              </div>
            </div>
          ) : (
            <>
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
                  {Object.entries(
                    filteredShows.reduce((acc, show) => {
                      const key = `${show.theater}-${show.format}`;
                      if (!acc[key]) {
                        acc[key] = {
                          theater: show.theater,
                          format: show.format,
                          shows: []
                        };
                      }
                      acc[key].shows.push(show);
                      return acc;
                    }, {} as Record<string, { theater: string; format: string; shows: typeof filteredShows }>)
                  ).map(([key, theaterGroup]) => (
                    <div key={key} className="theater-card">
                      <div className="theater-info">
                        <div className="theater-header">
                          <h3 className="theater-name">{theaterGroup.theater}</h3>
                          <span className="format-tag">{theaterGroup.format}</span>
                        </div>
                        <div className="theater-meta">
                          <span className="seats-info">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            Available
                          </span>
                        </div>
                      </div>
                      <div className="showtimes-grid">
                        {theaterGroup.shows
                          .sort((a, b) => new Date(a.showDateTime).getTime() - new Date(b.showDateTime).getTime())
                          .map((show) => (
                            <button
                              key={show.id}
                              className={`showtime-btn ${show.availableSeats === 0 ? 'sold-out' : ''}`}
                              onClick={() => handleShowSelection(show)}
                              disabled={show.availableSeats === 0}
                            >
                              <div className="time">
                                {new Date(show.showDateTime).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: true
                                })}
                              </div>
                              <div className="price">₹{show.price}</div>
                              {show.availableSeats === 0 && <div className="sold-out-text">SOLD OUT</div>}
                            </button>
                          ))
                        }
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
