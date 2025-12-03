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
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  useEffect(() => {
    loadMovieDetails();
  }, [movieId]);

  const loadMovieDetails = async () => {
    try {
      setLoading(true);
      // Mock data for movie detail
      const mockMovie: Event = {
        id: movieId || "1",
        title: "Inception",
        description: "A skilled thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
        category: "movie",
        imageUrl: "https://via.placeholder.com/400x600?text=Inception",
        rating: 8.8,
        duration: 148,
        releaseDate: "2010-07-16",
        language: "English",
      };

      const mockShows: Show[] = [
        {
          id: "s1",
          eventId: movieId || "1",
          showDateTime: new Date(Date.now() + 86400000).toISOString(),
          theater: "IMAX Theater",
          format: "3D",
          language: "English",
          price: 250,
          availableSeats: 45,
          totalSeats: 100,
        },
        {
          id: "s2",
          eventId: movieId || "1",
          showDateTime: new Date(Date.now() + 172800000).toISOString(),
          theater: "Standard Theater",
          format: "2D",
          language: "English",
          price: 150,
          availableSeats: 60,
          totalSeats: 100,
        },
      ];

      setMovie(mockMovie);
      setShows(mockShows);
    } catch (error) {
      console.error("Error loading movie details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatSelection = (seatNumber: string) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleBooking = () => {
    if (!selectedShow || selectedSeats.length === 0) {
      alert("Please select a show and at least one seat");
      return;
    }
    // Navigate to payment page or confirmation
    console.log("Booking:", { movie, show: selectedShow, seats: selectedSeats });
    alert(`Booking ${selectedSeats.length} seats for ₹${selectedSeats.length * selectedShow.price}`);
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!movie) {
    return <div className="alert alert-danger m-4">Movie not found</div>;
  }

  return (
    <div className="movie-detail-page">
      {/* Movie Header */}
      <div className="movie-header" style={{ backgroundImage: `url(${movie.imageUrl})` }}>
        <div className="header-overlay"></div>
        <div className="container header-content">
          <button className="btn btn-light mb-3" onClick={() => navigate("/movies")}>
            ← Back to Movies
          </button>
          <div className="row align-items-end">
            <div className="col-md-3">
              <img src={movie.imageUrl} alt={movie.title} className="movie-poster" />
            </div>
            <div className="col-md-9">
              <h1 className="movie-title">{movie.title}</h1>
              <div className="movie-meta">
                {movie.rating && <span className="badge bg-warning">⭐ {movie.rating}/10</span>}
                {movie.language && <span className="badge bg-info">{movie.language}</span>}
                {movie.duration && <span className="badge bg-secondary">{movie.duration} mins</span>}
              </div>
              <p className="movie-description mt-3">{movie.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Shows Selection */}
      <div className="container my-5">
        <h2 className="section-title">Select Show</h2>
        <div className="row g-3">
          {shows.map((show) => (
            <div key={show.id} className="col-md-6">
              <div
                className={`show-card ${selectedShow?.id === show.id ? "selected" : ""}`}
                onClick={() => setSelectedShow(show)}
              >
                <div className="show-info">
                  <h5>
                    {new Date(show.showDateTime).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </h5>
                  <p className="text-muted">
                    {show.theater} • {show.format}
                  </p>
                  <p className="text-success">
                    {show.availableSeats} seats available
                  </p>
                  <h6 className="price">₹{show.price} per seat</h6>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seat Selection */}
      {selectedShow && (
        <div className="container my-5">
          <h2 className="section-title">Select Seats</h2>
          <div className="seat-container">
            <div className="screen mb-4">SCREEN</div>
            <div className="seats-grid">
              {Array.from({ length: selectedShow.totalSeats }, (_, i) => {
                const seatNumber = `${String.fromCharCode(65 + Math.floor(i / 10))}${(i % 10) + 1}`;
                const isBooked = i > selectedShow.totalSeats - selectedShow.availableSeats - 1;
                const isSelected = selectedSeats.includes(seatNumber);

                return (
                  <button
                    key={seatNumber}
                    className={`seat ${isBooked ? "booked" : ""} ${isSelected ? "selected" : ""}`}
                    disabled={isBooked}
                    onClick={() => !isBooked && handleSeatSelection(seatNumber)}
                    title={seatNumber}
                  >
                    {seatNumber}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Booking Summary */}
          <div className="booking-summary mt-5">
            <h3>Booking Summary</h3>
            <div className="summary-details">
              <p>
                <strong>Movie:</strong> {movie.title}
              </p>
              <p>
                <strong>Show:</strong>{" "}
                {new Date(selectedShow.showDateTime).toLocaleString()}
              </p>
              <p>
                <strong>Theater:</strong> {selectedShow.theater} ({selectedShow.format})
              </p>
              <p>
                <strong>Seats:</strong> {selectedSeats.length > 0 ? selectedSeats.join(", ") : "No seats selected"}
              </p>
              <h5 className="total-price">
                Total: ₹{selectedSeats.length * selectedShow.price}
              </h5>
            </div>
            <button
              className="btn btn-primary btn-lg w-100"
              onClick={handleBooking}
              disabled={selectedSeats.length === 0}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
