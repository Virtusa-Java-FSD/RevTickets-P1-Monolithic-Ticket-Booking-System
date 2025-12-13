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
      
      // Movie data matching the Movies page
      const moviesData: { [key: string]: Event } = {
        "1": {
          id: "1",
          title: "Inception",
          description: "A skilled thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.",
          category: "movie",
          genre: "Sci-Fi, Thriller",
          imageUrl: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
          rating: 8.8,
          duration: 148,
          releaseDate: "2010-07-16",
          language: "English",
          price: 250,
          format: "2D, 3D, IMAX",
        },
        "2": {
          id: "2",
          title: "The Dark Knight",
          description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
          category: "movie",
          genre: "Action, Crime",
          imageUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
          rating: 9.0,
          duration: 152,
          releaseDate: "2008-07-18",
          language: "English",
          price: 300,
          format: "2D, IMAX",
        },
        "3": {
          id: "3",
          title: "Interstellar",
          description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
          category: "movie",
          genre: "Sci-Fi, Drama",
          imageUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
          rating: 8.6,
          duration: 169,
          releaseDate: "2014-11-07",
          language: "English",
          price: 280,
          format: "2D, IMAX",
        },
        "4": {
          id: "4",
          title: "Pushpa",
          description: "A man rises to power by dealing in red sanders smuggling in the forests of Andhra Pradesh.",
          category: "movie",
          genre: "Action, Drama",
          imageUrl: "https://image.tmdb.org/t/p/w500/vVpEOvdxVBP2aV166j5Xlvb5Cdc.jpg",
          rating: 7.5,
          duration: 179,
          releaseDate: "2021-12-17",
          language: "Telugu",
          price: 200,
          format: "2D",
        },
        "5": {
          id: "5",
          title: "3 Idiots",
          description: "Two friends are searching for their long lost companion. They revisit their college days and recall the memories of their friend who inspired them to think differently.",
          category: "movie",
          genre: "Comedy, Drama",
          imageUrl: "https://image.tmdb.org/t/p/w500/66A9MqXOyVFCssoloscw79z8U0Y.jpg",
          rating: 8.4,
          duration: 170,
          releaseDate: "2009-12-25",
          language: "Hindi",
          price: 220,
          format: "2D",
        },
        "6": {
          id: "6",
          title: "Avatar",
          description: "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.",
          category: "movie",
          genre: "Sci-Fi, Adventure",
          imageUrl: "https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg",
          rating: 7.8,
          duration: 162,
          releaseDate: "2009-12-18",
          language: "English",
          price: 350,
          format: "2D, 3D, IMAX",
        },
        "7": {
          id: "7",
          title: "RRR",
          description: "A fictional story about two legendary revolutionaries and their journey away from home before they started fighting for their country in 1920s.",
          category: "movie",
          genre: "Action, Drama",
          imageUrl: "https://image.tmdb.org/t/p/w500/wR0PIlQGKXRhS0JQUZlVsFf7IL6.jpg",
          rating: 8.0,
          duration: 187,
          releaseDate: "2022-03-25",
          language: "Telugu",
          price: 250,
          format: "2D, 3D",
        },
        "8": {
          id: "8",
          title: "Dangal",
          description: "A former wrestler trains his daughters to become world-class wrestlers and overcome societal barriers.",
          category: "movie",
          genre: "Biography, Drama",
          imageUrl: "https://image.tmdb.org/t/p/w500/9suZQO8DwRyDUWB1fVIuKOHzoDz.jpg",
          rating: 8.3,
          duration: 161,
          releaseDate: "2016-12-23",
          language: "Hindi",
          price: 200,
          format: "2D",
        },
        "9": {
          id: "9",
          title: "Avengers: Endgame",
          description: "After the devastating events of Avengers: Infinity War, the universe is in ruins. The Avengers assemble once more to reverse Thanos' actions.",
          category: "movie",
          genre: "Action, Adventure",
          imageUrl: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
          rating: 8.4,
          duration: 181,
          releaseDate: "2019-04-26",
          language: "English",
          price: 400,
          format: "2D, 3D, IMAX",
        },
        "10": {
          id: "10",
          title: "Baahubali 2",
          description: "When Shiva, the son of Bahubali, learns about his heritage, he begins to look for answers. His story is juxtaposed with past events that unfolded in the Mahishmati Kingdom.",
          category: "movie",
          genre: "Action, Drama",
          imageUrl: "https://image.tmdb.org/t/p/w500/w2nENOEUxW1MMTyEb6LfL3mEZpV.jpg",
          rating: 8.2,
          duration: 167,
          releaseDate: "2017-04-28",
          language: "Telugu",
          price: 230,
          format: "2D",
        },
        "11": {
          id: "11",
          title: "The Shawshank Redemption",
          description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
          category: "movie",
          genre: "Drama",
          imageUrl: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
          rating: 9.3,
          duration: 142,
          releaseDate: "1994-09-23",
          language: "English",
          price: 180,
          format: "2D",
        },
        "12": {
          id: "12",
          title: "KGF Chapter 2",
          description: "Rocky continues his reign as the king of the gold mines and faces new challenges from his enemies.",
          category: "movie",
          genre: "Action, Drama",
          imageUrl: "https://image.tmdb.org/t/p/w500/8y4AwlbY8FGQMNh1bz8u9OqkIG5.jpg",
          rating: 8.4,
          duration: 168,
          releaseDate: "2022-04-14",
          language: "Kannada",
          price: 250,
          format: "2D",
        },
        "13": {
          id: "13",
          title: "Titanic",
          description: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.",
          category: "movie",
          genre: "Romance, Drama",
          imageUrl: "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
          rating: 7.9,
          duration: 194,
          releaseDate: "1997-12-19",
          language: "English",
          price: 200,
          format: "2D",
        },
        "14": {
          id: "14",
          title: "Pathaan",
          description: "An Indian spy takes on the leader of a group of mercenaries who have nefarious plans to target his homeland.",
          category: "movie",
          genre: "Action, Thriller",
          imageUrl: "https://image.tmdb.org/t/p/w500/qmJGd5IfURq8iPQ9KF3les47vFS.jpg",
          rating: 7.8,
          duration: 146,
          releaseDate: "2023-01-25",
          language: "Hindi",
          price: 300,
          format: "2D, IMAX",
        },
        "15": {
          id: "15",
          title: "Jawan",
          description: "A high-octane action thriller which outlines the emotional journey of a man who is set to rectify the wrongs in society.",
          category: "movie",
          genre: "Action, Thriller",
          imageUrl: "https://image.tmdb.org/t/p/w500/uV6ej1JsYbjJP4kkLT6RSFLbRQe.jpg",
          rating: 7.2,
          duration: 169,
          releaseDate: "2023-09-07",
          language: "Hindi",
          price: 320,
          format: "2D, IMAX",
        },
      };

      const foundMovie = moviesData[movieId || "1"];
      
      if (!foundMovie) {
        setMovie(null);
        setLoading(false);
        return;
      }

      // Generate shows for current week with multiple showtimes like BookMyShow
      const mockShows: Show[] = [];
      const theaters = [
        { name: "PVR Cinemas", formats: ["2D", "3D", "IMAX"] },
        { name: "INOX Megaplex", formats: ["2D", "3D", "IMAX"] },
        { name: "Cinepolis", formats: ["2D", "3D"] },
        { name: "Carnival Cinemas", formats: ["2D"] },
        { name: "Miraj Cinemas", formats: ["2D", "3D"] },
        { name: "AMB Cinemas", formats: ["2D", "IMAX"] },
      ];
      
      const timeSlots = [
        "9:30 AM", "10:15 AM", "12:30 PM", "1:15 PM", "3:30 PM", 
        "4:15 PM", "6:30 PM", "7:15 PM", "9:30 PM", "10:15 PM"
      ];
      
      // Calculate days for next 7 days
      
      for (let day = 0; day < 7; day++) {
        const dayOffset = 86400000 * day;
        
        theaters.forEach((theater, theaterIdx) => {
          // Each theater gets 4-6 random showtimes per day
          const numShows = 4 + Math.floor(Math.random() * 3);
          const selectedTimes = timeSlots.sort(() => 0.5 - Math.random()).slice(0, numShows);
          
          selectedTimes.forEach((time, timeIdx) => {
            theater.formats.forEach((format) => {
              const [hours, minutes, period] = time.match(/(\d+):(\d+)\s(AM|PM)/)?.slice(1) || [];
              let hour = parseInt(hours);
              if (period === "PM" && hour !== 12) hour += 12;
              if (period === "AM" && hour === 12) hour = 0;
              
              const showDate = new Date(Date.now() + dayOffset);
              showDate.setHours(hour, parseInt(minutes), 0, 0);
              
              // Skip past showtimes for today
              if (day === 0 && showDate < new Date()) return;
              
              const basePrice = foundMovie.price || 200;
              let formatPrice = basePrice;
              if (format === "3D") formatPrice += 50;
              if (format === "IMAX") formatPrice += 100;
              
              mockShows.push({
                id: `show-${movieId}-${day}-${theaterIdx}-${timeIdx}-${format}`,
                eventId: movieId || "1",
                showDateTime: showDate.toISOString(),
                theater: theater.name,
                format,
                language: foundMovie.language || "English",
                price: formatPrice,
                availableSeats: Math.floor(Math.random() * 80) + 20,
                totalSeats: 100,
              });
            });
          });
        });
      }
      


      setMovie(foundMovie);
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
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                      theater: show.theater || '',
                      format: show.format || '',
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
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
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
