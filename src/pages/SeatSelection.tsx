import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const { showId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState<any>(null);
  const [seats, setSeats] = useState<Seat[]>([]);

  useEffect(() => {
    const loadShow = async () => {
      try {
        if (!showId) return;
        const { getShow } = await import("../utils/api");
        const showData = await getShow(showId);
        setShow(showData);

        // Generate seats based on show capacity or fixed layout
        // For simplicity, we keep the fixed layout but ideally this should come from backend
        // We will mark random seats as booked if backend doesn't provide seat map
        const allSeats: Seat[] = [];
        const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
        const seatsPerRow = 10;

        // Use bookedSeats from showData if available
        const bookedSeatIds = showData.bookedSeats || [];

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

    if (selectedSeats.length > 0) {
      navigate("/payment", {
        state: {
          seats: selectedSeats.map((s) => s.id),
          total: totalPrice,
          showId: showId,
          bookingType: "MOVIE"
        },
      });
    }
  };

  const getCategorySeats = (category: string) => {
    return seats.filter((s) => s.category === category);
  };

  return (
    <div className="seat-selection-page">
      <div className="seat-header">
        <div className="container">
          <button className="back-btn" onClick={() => navigate('/movies')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" />
            </svg>
          </button>
          <div>
            <h5 className="mb-0">Movie Name</h5>
            <p className="small text-muted mb-0">PVR Cinemas | Today, 7:00 PM</p>
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
