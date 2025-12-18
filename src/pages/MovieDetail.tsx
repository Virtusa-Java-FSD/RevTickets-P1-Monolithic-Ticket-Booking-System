import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Event } from "../types/Event";
import type { Show } from "../types/Show";
import "../styles/movieDetail.css";
import "../styles/bookMyShowStyles.css";

// Helper function to convert 12-hour time to 24-hour format
const convertTimeTo24Hour = (time12h: string): string => {
  if (!time12h) return '';
  
  const time = time12h.trim().toUpperCase();
  const [timePart, period] = time.split(/\s*(AM|PM)/);
  if (!timePart) return '';
  
  const [hours, minutes = '00'] = timePart.split(':');
  let hour24 = parseInt(hours, 10);
  
  if (period === 'PM' && hour24 !== 12) {
    hour24 += 12;
  } else if (period === 'AM' && hour24 === 12) {
    hour24 = 0;
  }
  
  return `${hour24.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
};

const MovieDetail = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Event | null>(null);
  const [shows, setShows] = useState<Show[]>([]);

  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>("");
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
      console.log("Loaded shows:", showsData);
      console.log("Theaters in shows:", [...new Set(showsData.map(s => s.theater))]);
      // Ensure date format is correct for sorting/display
      setShows(showsData);

      // Get available dates from shows (handle both showDateTime and showDate formats)
      const dates = new Set<string>();
      showsData.forEach((s: Show) => {
        let dateObj: Date | null = null;
        
        if (s.showDateTime) {
          dateObj = new Date(s.showDateTime);
        } else if ((s as any).showDate) {
          dateObj = new Date((s as any).showDate + 'T00:00:00');
        }
        
        if (dateObj && !isNaN(dateObj.getTime())) {
          dates.add(dateObj.toDateString());
        }
      });
      
      if (dates.size > 0) {
        // Sort dates and select the first one
        const sortedDates = Array.from(dates)
          .map(d => new Date(d))
          .filter(d => !isNaN(d.getTime()))
          .sort((a, b) => a.getTime() - b.getTime());
        
        if (sortedDates.length > 0) {
          setSelectedDate(sortedDates[0].toDateString());
        }
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


  const getAvailableDates = () => {
    const dates = new Set<string>();
    shows.forEach(show => {
      let dateObj: Date | null = null;
      
      if (show.showDateTime) {
        dateObj = new Date(show.showDateTime);
      } else if (show.showDate) {
        // Parse date string (YYYY-MM-DD format)
        dateObj = new Date(show.showDate + 'T00:00:00');
      }
      
      if (dateObj && !isNaN(dateObj.getTime())) {
        dates.add(dateObj.toDateString());
      }
    });
    
    // Convert to Date objects and sort
    return Array.from(dates)
      .map(dateStr => new Date(dateStr))
      .filter(date => !isNaN(date.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());
  };

  const getShowsForDate = (dateStr: string) => {
    let filtered = shows.filter(show => {
      let showDateObj: Date | null = null;
      
      if (show.showDateTime) {
        showDateObj = new Date(show.showDateTime);
      } else if (show.showDate) {
        showDateObj = new Date(show.showDate + 'T00:00:00');
      }
      
      if (showDateObj && !isNaN(showDateObj.getTime())) {
        return showDateObj.toDateString() === dateStr;
      }
      return false;
    });
    
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
            <div className="format-filter">
              {getAvailableFormats().map((format) => (
                <button
                  key={format}
                  className={`format-filter-btn ${selectedFormat === format ? 'active' : ''}`}
                  onClick={() => setSelectedFormat(format)}
                >
                  {format}
                </button>
              ))}
            </div>
<<<<<<< HEAD

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
=======
>>>>>>> Develop
          </div>

          <div className="date-selector">
            {availableDates.length > 0 ? (
              availableDates.map((date, index) => {
                // Safety check for valid date
                if (isNaN(date.getTime())) {
                  return null;
                }
                return (
                  <button
                    key={index}
                    className={`date-btn ${selectedDate === date.toDateString() ? 'active' : ''}`}
                    onClick={() => setSelectedDate(date.toDateString())}
                  >
                    <div className="date-day">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    <div className="date-number">{date.getDate()}</div>
                    <div className="date-month">{date.toLocaleDateString('en-US', { month: 'short' })}</div>
                  </button>
                );
              })
            ) : (
              <div className="no-dates">No dates available</div>
            )}
          </div>

          {filteredShows.length === 0 ? (
            <div className="no-shows">
              <p>No shows available for this date</p>
            </div>
          ) : (
            <div className="theaters-list">
              {Object.entries(
                filteredShows.reduce((acc, show) => {
                  // Handle cases where theater or format might be undefined
                  const theaterName = show.theater || "Theater TBD";
                  const formatName = show.format || "Standard";
                  const key = `${theaterName}-${formatName}`;
                  if (!acc[key]) {
                    acc[key] = {
                      theater: theaterName,
                      format: formatName,
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
                      {theaterGroup.format && <span className="format-tag">{theaterGroup.format}</span>}
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
                      .sort((a, b) => {
                        // Handle different date formats from backend
                        let dateA = 0;
                        let dateB = 0;
                        
                        if (a.showDateTime) {
                          const d = new Date(a.showDateTime);
                          dateA = !isNaN(d.getTime()) ? d.getTime() : 0;
                        } else if (a.showDate && a.showTime) {
                          // Try to parse combined date and time
                          const time24h = a.showTime.includes('AM') || a.showTime.includes('PM') 
                            ? convertTimeTo24Hour(a.showTime) 
                            : a.showTime;
                          const d = new Date(`${a.showDate}T${time24h}`);
                          dateA = !isNaN(d.getTime()) ? d.getTime() : 0;
                        }
                        
                        if (b.showDateTime) {
                          const d = new Date(b.showDateTime);
                          dateB = !isNaN(d.getTime()) ? d.getTime() : 0;
                        } else if (b.showDate && b.showTime) {
                          const time24h = b.showTime.includes('AM') || b.showTime.includes('PM')
                            ? convertTimeTo24Hour(b.showTime)
                            : b.showTime;
                          const d = new Date(`${b.showDate}T${time24h}`);
                          dateB = !isNaN(d.getTime()) ? d.getTime() : 0;
                        }
                        
                        return dateA - dateB;
                      })
                      .map((show) => {
                        // Format time for display
                        let displayTime = "";
                        if (show.showDateTime) {
                          const date = new Date(show.showDateTime);
                          if (!isNaN(date.getTime())) {
                            displayTime = date.toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true
                            });
                          } else {
                            displayTime = show.showTime || "TBD";
                          }
                        } else if (show.showTime) {
                          displayTime = show.showTime;
                        } else {
                          displayTime = "TBD";
                        }

                        return (
                          <button
                            key={show.id}
                            className={`showtime-btn ${show.availableSeats === 0 ? 'sold-out' : ''}`}
                            onClick={() => handleShowSelection(show)}
                            disabled={show.availableSeats === 0}
                          >
                            <div className="time">{displayTime}</div>
                            <div className="price">₹{show.price || 0}</div>
                            {show.availableSeats === 0 && <div className="sold-out-text">SOLD OUT</div>}
                          </button>
                        );
                      })
                    }
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
