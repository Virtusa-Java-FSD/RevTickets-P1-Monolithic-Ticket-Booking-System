import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Event } from "../types/Event";
import "../styles/seatSelection.css";

interface Seat {
  id: string;
  row: string;
  number: number;
  status: "available" | "selected" | "booked";
  price: number;
  category: "classic" | "premium" | "executive";
}

const SeatSelection = () => {
  const {} = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState<any>(null);
  const [movie, setMovie] = useState<Event | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);

  useEffect(() => {
    const loadShow = async () => {
      try {
        if (!showId) return;
        setLoading(true);
        const { getShow, getEvent, getBookedSeats } = await import("../utils/api");
        const showData = await getShow(showId);
        setShow(showData);

        // Load movie/event details if eventId is available
        if (showData.eventId) {
          try {
            const eventData = await getEvent(showData.eventId);
            setMovie(eventData);
          } catch (err) {
            console.error("Failed to load event:", err);
          }
        }

        // Fetch booked seats from backend
        let bookedSeatIds: string[] = [];
        try {
          bookedSeatIds = await getBookedSeats(showId);
        } catch (err) {
          console.error("Failed to load booked seats, using show data:", err);
          bookedSeatIds = showData.bookedSeats || [];
        }

        // Generate seats based on show capacity or fixed layout
        const allSeats: Seat[] = [];
        const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
        const seatsPerRow = 10;

        rows.forEach((row, rowIndex) => {
          for (let i = 1; i <= seatsPerRow; i++) {
            const seatId = `${row}${i}`;
            // If we have real booked data, use it. Else mock some if necessary or start clean.
            // Since we moved to real backend, let's trust the backend data.
            // If backend has no bookedSeats, all are available.
            const isBooked = bookedSeatIds.includes(seatId);

            let category: "classic" | "premium" | "executive" = "classic";
            let price = showData.price || 150;

            if (rowIndex < 2) {
              category = "executive";
              price = (showData.price || 150) + 100;
            } else if (rowIndex < 5) {
              category = "premium";
              price = (showData.price || 150) + 50;
            }

            allSeats.push({
              id: seatId,
              row,
              number: i,
              status: isBooked ? "booked" : "available",
              price,
              category,
            });
          }
        });
        setSeats(allSeats);

      } catch (err) {
        console.error("Failed to load show:", err);
      } finally {
        setLoading(false);
      }
    };
    loadShow();
  }, [showId]);

  const handleSeatClick = (seatId: string) => {
    setSeats((prev) =>
      prev.map((seat) =>
        seat.id === seatId && seat.status !== "booked"
          ? { ...seat, status: seat.status === "selected" ? "available" : "selected" }
          : seat
      )
    );
  };

  const selectedSeats = seats.filter((s) => s.status === "selected");
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  const handleProceed = () => {
    // Check authentication before proceeding
    const authData = localStorage.getItem('rev_auth');
    if (!authData) {
      alert("Please login to proceed with booking");
      navigate('/login');
      return;
    }

    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }

    if (selectedSeats.length > 0) {
      const seatIds = selectedSeats.map((s) => s.id).filter(id => id && id.trim());
      console.log('Navigating to payment with seats:', seatIds);
      console.log('Selected seats count:', seatIds.length);
      
      if (seatIds.length === 0) {
        alert("Invalid seat selection. Please try again.");
        return;
      }

      navigate("/payment", {
        state: {
          seats: seatIds,
          total: totalPrice,
          showId: showId,
          bookingType: "MOVIE",
          eventId: show?.eventId || movie?.id,
          event: movie
        },
      });
    }
  };

  const getCategorySeats = (category: string) => {
    return seats.filter((s) => s.category === category);
  };

  // Format show date and time
  const formatShowDateTime = () => {
    if (!show) return "Loading...";
    
    // Handle different date formats from backend
    let showDate: Date;
    if (show.showDateTime) {
      showDate = new Date(show.showDateTime);
    } else if (show.showDate && show.showTime) {
      showDate = new Date(`${show.showDate}T${show.showTime}`);
    } else {
      return "Date TBD";
    }

    const dateStr = showDate.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
    const timeStr = show.showTime || showDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    const theaterName = show.theater || "Theater TBD";
    return `${theaterName} | ${dateStr}, ${timeStr}`;
  };

  if (loading) {
    return (
      <div className="seat-selection-page">
        <div className="container py-5 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading seat selection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="seat-selection-page">
      <div className="seat-header">
        <div className="container">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" />
            </svg>
          </button>
          <div>
            <h5 className="mb-0">{movie?.title || "Movie"}</h5>
            <p className="small text-muted mb-0">{formatShowDateTime()}</p>
          </div>
        </div>
      </div>

      <div className="container py-4">
        {/* Screen */}
        <div className="screen-wrapper">
          <div className="screen-indicator">
            <div className="screen-line"></div>
            <p className="screen-text">All eyes this way please!</p>
          </div>
        </div>

        {/* Seat Map by Category */}
        <div className="seat-map-container">
          {/* Executive */}
          {getCategorySeats("executive").length > 0 && (
            <div className="seat-category">
              <div className="category-header">
                <span className="category-name">Executive - ₹300</span>
                <span className="category-available">
                  {getCategorySeats("executive").filter((s) => s.status === "available").length} Available
                </span>
              </div>
              <div className="seat-grid">
                {["A", "B"].map((row) => (
                  <div key={row} className="seat-row">
                    <span className="row-label">{row}</span>
                    <div className="seats">
                      {seats
                        .filter((seat) => seat.row === row)
                        .map((seat) => (
                          <button
                            key={seat.id}
                            className={`seat ${seat.status} ${seat.category}`}
                            onClick={() => handleSeatClick(seat.id)}
                            disabled={seat.status === "booked"}
                            title={`${seat.id} - ₹${seat.price}`}
                          >
                            <span className="seat-icon">🪑</span>
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Premium */}
          {getCategorySeats("premium").length > 0 && (
            <div className="seat-category">
              <div className="category-header">
                <span className="category-name">Premium - ₹200</span>
                <span className="category-available">
                  {getCategorySeats("premium").filter((s) => s.status === "available").length} Available
                </span>
              </div>
              <div className="seat-grid">
                {["C", "D", "E"].map((row) => (
                  <div key={row} className="seat-row">
                    <span className="row-label">{row}</span>
                    <div className="seats">
                      {seats
                        .filter((seat) => seat.row === row)
                        .map((seat) => (
                          <button
                            key={seat.id}
                            className={`seat ${seat.status} ${seat.category}`}
                            onClick={() => handleSeatClick(seat.id)}
                            disabled={seat.status === "booked"}
                            title={`${seat.id} - ₹${seat.price}`}
                          >
                            <span className="seat-icon">🪑</span>
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Classic */}
          {getCategorySeats("classic").length > 0 && (
            <div className="seat-category">
              <div className="category-header">
                <span className="category-name">Classic - ₹150</span>
                <span className="category-available">
                  {getCategorySeats("classic").filter((s) => s.status === "available").length} Available
                </span>
              </div>
              <div className="seat-grid">
                {["F", "G", "H"].map((row) => (
                  <div key={row} className="seat-row">
                    <span className="row-label">{row}</span>
                    <div className="seats">
                      {seats
                        .filter((seat) => seat.row === row)
                        .map((seat) => (
                          <button
                            key={seat.id}
                            className={`seat ${seat.status} ${seat.category}`}
                            onClick={() => handleSeatClick(seat.id)}
                            disabled={seat.status === "booked"}
                            title={`${seat.id} - ₹${seat.price}`}
                          >
                            <span className="seat-icon">🪑</span>
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="seat-legend">
          <div className="legend-item">
            <div className="legend-box available">🪑</div>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <div className="legend-box selected">🪑</div>
            <span>Selected</span>
          </div>
          <div className="legend-item">
            <div className="legend-box booked">🪑</div>
            <span>Booked</span>
          </div>
        </div>
      </div>

      {/* Booking Summary */}
      {selectedSeats.length > 0 && (
        <div className="booking-bar">
          <div className="container">
            <div className="booking-info">
              <div className="seats-info">
                <p className="mb-0 fw-bold">{selectedSeats.map((s) => s.id).join(", ")}</p>
                <p className="small text-muted mb-0">{selectedSeats.length} Seat(s)</p>
              </div>
              <div className="price-info">
                <p className="mb-0 fw-bold">₹{totalPrice}</p>
                <button className="btn btn-danger" onClick={handleProceed}>
                  Pay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatSelection;
