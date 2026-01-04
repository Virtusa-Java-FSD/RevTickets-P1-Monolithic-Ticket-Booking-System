import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Event } from "../types/Event";
import { getEvent, getShowsByEventId } from "../utils/api";
import "../styles/concert-booking.css";

interface Seat {
  id: string;
  row: string;
  number: number;
  category: "VIP" | "Premium" | "Standard";
  price: number;
  isBooked: boolean;
}

const ConcertBooking = () => {
  const { concertId } = useParams();
  console.log("ConcertBooking loaded with ID:", concertId);
  const navigate = useNavigate();
  const [concert, setConcert] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [step, setStep] = useState(1);

  const [shows, setShows] = useState<any[]>([]);
  const [selectedShow, setSelectedShow] = useState<any>(null);

  // Derive available dates from shows
  const availableDates = [...new Set(shows.map((s: any) => s.showDate))].sort();
  // Derive times for selected date
  const showTimes = selectedDate
    ? [...new Set(shows.filter((s: any) => s.showDate === selectedDate).map((s: any) => s.showTime))].sort()
    : [];

  useEffect(() => {
    loadConcertDetails();
    generateSeats();
  }, [concertId]);

  useEffect(() => {
    if (selectedDate && selectedTime) {
      const show = shows.find((s: any) => s.showDate === selectedDate && s.showTime === selectedTime);
      setSelectedShow(show);

      if (show && show.bookedSeats) {
        setSeats(prevSeats => prevSeats.map(seat => ({
          ...seat,
          isBooked: show.bookedSeats.includes(seat.id)
        })));
      } else {
        // Reset if no show or no booked seats
        setSeats(prevSeats => prevSeats.map(seat => ({
          ...seat,
          isBooked: false
        })));
      }
    } else {
      setSelectedShow(null);
      setSeats(prevSeats => prevSeats.map(seat => ({
        ...seat,
        isBooked: false
      })));
    }
  }, [selectedDate, selectedTime, shows]);

  const loadConcertDetails = async () => {
    try {
      setLoading(true);
      if (concertId) {
        const event = await getEvent(concertId);
        setConcert(event);
        const eventShows = await getShowsByEventId(concertId);
        setShows(eventShows);
      }
    } catch (err) {
      console.error("Error loading concert:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateSeats = () => {
    const seatLayout: Seat[] = [];
    const categories = [
      { name: "VIP", rows: ["A", "B"], price: 5000 },
      { name: "Premium", rows: ["C", "D", "E"], price: 3000 },
      { name: "Standard", rows: ["F", "G", "H", "I", "J"], price: 1500 },
    ];

    categories.forEach((cat) => {
      cat.rows.forEach((row) => {
        for (let i = 1; i <= 15; i++) {
          seatLayout.push({
            id: `${row}${i}`,
            row,
            number: i,
            category: cat.name as "VIP" | "Premium" | "Standard",
            price: cat.price,
            isBooked: false, // Will be updated based on show
          });
        }
      });
    });

    setSeats(seatLayout);
  };

  const handleSeatClick = (seat: Seat) => {
    if (seat.isBooked) return;

    const isSelected = selectedSeats.find((s) => s.id === seat.id);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      if (selectedSeats.length < 10) {
        setSelectedSeats([...selectedSeats, seat]);
      } else {
        alert("Maximum 10 seats can be selected");
      }
    }
  };

  const getTotalPrice = () => {
    return selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  };

  const getConvenienceFee = () => {
    return Math.round(getTotalPrice() * 0.05);
  };

  const handleProceedToPayment = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select date and time");
      return;
    }
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }
    setStep(2);
  };

  const handleConfirmBooking = () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert("Please fill all customer details");
      return;
    }

    // Redirect to Payment Page
    navigate('/payment', {
      state: {
        total: getTotalPrice() + getConvenienceFee(),
        seats: selectedSeats.map(s => s.id),
        bookingType: 'CONCERT', // Treated as Event in backend potentially, or Add Concert Type
        // If backend only has EVENT/MOVIE/TRAVEL, map CONCERT to EVENT
        eventId: concertId,
        showId: selectedShow ? selectedShow.id : null,
        event: concert,
        additionalDetails: {
          customerInfo,
          date: selectedDate,
          time: selectedTime
        }
      }
    });
  };

  const filteredSeats =
    activeCategory === "all"
      ? seats
      : seats.filter((s) => s.category === activeCategory);

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!concert) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">Concert not found</div>
      </div>
    );
  }

  return (
    <div className="concert-booking-page">
      <div className="booking-header" style={{ padding: '1rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button
            onClick={() => step === 1 ? navigate("/concerts") : setStep(1)}
            style={{
              padding: '8px 16px', // Increased padding
              fontSize: '14px',
              background: '#fff', // Pure white
              border: '1px solid #ccc',
              borderRadius: '6px',
              color: '#000', // Pure black
              cursor: 'pointer',
              display: 'flex', // flex vs inline-flex
              alignItems: 'center',
              gap: '8px',
              fontWeight: '700',
              boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
              margin: 0,
              zIndex: 100, // Force on top
              position: 'relative',
              minWidth: '80px', // Prevent collapse
              justifyContent: 'center'
            }}
          >
            <span>←</span> Back
          </button>
          <div>
            <h1 style={{ fontSize: '1.75rem', margin: 0, lineHeight: 1.2 }}>{concert.title}</h1>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem' }}>{concert.description}</p>
          </div>
        </div>
      </div>

      <div className="container my-3">
        {/* Progress Steps */}
        <div className="booking-steps" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
          <div className={`step ${step >= 1 ? "active" : ""}`}>
            <div className="step-number">1</div>
            <div className="step-label">Select Seats</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 2 ? "active" : ""}`}>
            <div className="step-number">2</div>
            <div className="step-label">Customer Details</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 3 ? "active" : ""}`}>
            <div className="step-number">3</div>
            <div className="step-label">Payment</div>
          </div>
        </div>

        {step === 1 && (
          <div className="row g-4 mt-3">
            {/* Left Section - Seat Selection */}
            <div className="col-lg-8">
              <div className="booking-card">
                <h3>Select Date & Time</h3>
                <div className="date-time-selection">
                  <div className="date-options">
                    {availableDates.map((date) => (
                      <button
                        key={date}
                        className={`date-btn ${selectedDate === date ? "selected" : ""}`}
                        onClick={() => {
                          setSelectedDate(date);
                          setSelectedTime("");
                          setSelectedSeats([]);
                        }}
                      >
                        {new Date(date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </button>
                    ))}
                  </div>
                  <div className="time-options">
                    {showTimes.map((time) => (
                      <button
                        key={time}
                        className={`time-btn ${selectedTime === time ? "selected" : ""}`}
                        onClick={() => {
                          setSelectedTime(time);
                          setSelectedSeats([]);
                        }}
                        disabled={!selectedDate}
                        style={{ opacity: !selectedDate ? 0.5 : 1, cursor: !selectedDate ? 'not-allowed' : 'pointer' }}
                        title={!selectedDate ? "Select a date first" : ""}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <h3 className="mt-4" style={{ opacity: selectedTime ? 1 : 0.5 }}>Select Your Seats</h3>
                <div className="category-filter" style={{ opacity: selectedTime ? 1 : 0.5, pointerEvents: selectedTime ? 'auto' : 'none' }}>
                  <button
                    className={`cat-btn ${activeCategory === "all" ? "active" : ""}`}
                    onClick={() => setActiveCategory("all")}
                  >
                    All Seats
                  </button>
                  <button
                    className={`cat-btn vip ${activeCategory === "VIP" ? "active" : ""}`}
                    onClick={() => setActiveCategory("VIP")}
                  >
                    VIP - ₹5000
                  </button>
                  <button
                    className={`cat-btn premium ${activeCategory === "Premium" ? "active" : ""}`}
                    onClick={() => setActiveCategory("Premium")}
                  >
                    Premium - ₹3000
                  </button>
                  <button
                    className={`cat-btn standard ${activeCategory === "Standard" ? "active" : ""}`}
                    onClick={() => setActiveCategory("Standard")}
                  >
                    Standard - ₹1500
                  </button>
                </div>

                <div className="stage-indicator" style={{ opacity: selectedTime ? 1 : 0.5 }}>🎤 STAGE</div>

                <div className="seat-map" style={{ opacity: selectedTime ? 1 : 0.5 }}>
                  {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"].map((row) => (
                    <div key={row} className="seat-row">
                      <span className="row-label">{row}</span>
                      {filteredSeats
                        .filter((s) => s.row === row)
                        .map((seat) => (
                          <button
                            key={seat.id}
                            className={`seat ${seat.category.toLowerCase()} ${seat.isBooked
                              ? "booked"
                              : selectedSeats.find((s) => s.id === seat.id)
                                ? "selected"
                                : ""
                              }`}
                            onClick={() => {
                              if (!selectedTime) {
                                alert("Please select a date and time first.");
                                return;
                              }
                              handleSeatClick(seat);
                            }}
                            disabled={seat.isBooked}
                            title={!selectedTime ? "Select time first" : `${seat.id} - ₹${seat.price}`}
                          >
                            {seat.number}
                          </button>
                        ))}
                    </div>
                  ))}
                </div>

                <div className="seat-legend">
                  <div className="legend-item">
                    <div className="legend-box available"></div>
                    <span>Available</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-box selected"></div>
                    <span>Selected</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-box booked"></div>
                    <span>Booked</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Booking Summary */}
            <div className="col-lg-4">
              <div className="booking-card sticky-summary">
                <img
                  src={concert.imageUrl}
                  alt={concert.title}
                  className="summary-image"
                />
                <h4>{concert.title}</h4>
                {concert.rating && (
                  <div className="rating">⭐ {concert.rating}/10</div>
                )}

                <div className="summary-details">
                  <div className="detail-row">
                    <span>Date:</span>
                    <strong>
                      {selectedDate
                        ? new Date(selectedDate).toLocaleDateString()
                        : "Not selected"}
                    </strong>
                  </div>
                  <div className="detail-row">
                    <span>Time:</span>
                    <strong>{selectedTime || "Not selected"}</strong>
                  </div>
                  <div className="detail-row">
                    <span>Seats:</span>
                    <strong>
                      {selectedSeats.length > 0
                        ? selectedSeats.map((s) => s.id).join(", ")
                        : "None"}
                    </strong>
                  </div>
                </div>

                <div className="price-breakdown">
                  <h5>Price Details</h5>
                  {selectedSeats.map((seat) => (
                    <div key={seat.id} className="price-row">
                      <span>
                        {seat.id} ({seat.category})
                      </span>
                      <span>₹{seat.price}</span>
                    </div>
                  ))}
                  {selectedSeats.length > 0 && (
                    <>
                      <div className="price-row">
                        <span>Convenience Fee (5%)</span>
                        <span>₹{getConvenienceFee()}</span>
                      </div>
                      <hr />
                      <div className="price-row total">
                        <strong>Total Amount</strong>
                        <strong>₹{getTotalPrice() + getConvenienceFee()}</strong>
                      </div>
                    </>
                  )}
                </div>

                <button
                  className="proceed-btn"
                  onClick={handleProceedToPayment}
                  disabled={
                    !selectedDate || !selectedTime || selectedSeats.length === 0
                  }
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="row g-3 mt-2" style={{ justifyContent: 'center' }}>
            <div className="col-lg-7">
              <div className="booking-card">
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#1f2937' }}>Customer Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '16px' }}>
                  {/* Changed to 1 column for better mobile/narrow view, or keep 3 if preferred. User said "Keep styles unchanged" but spacing requested. */}
                  {/* Actually, user said keep card styles unchanged. I'll keep the grid as is but maybe responsive? */}
                  {/* Providing the original grid structure to match "unchanged". */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                        placeholder="Enter your full name"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          background: 'white',
                          color: '#1f2937',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                        placeholder="your@email.com"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          background: 'white',
                          color: '#1f2937',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        placeholder="+91 1234567890"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          background: 'white',
                          color: '#1f2937',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="col-lg-5">
              <div className="booking-card sticky-summary">
                <h4>Booking Summary</h4>
                <div className="summary-details">
                  <div className="detail-row">
                    <span>Concert:</span>
                    <strong>{concert.title}</strong>
                  </div>
                  <div className="detail-row">
                    <span>Date:</span>
                    <strong>{new Date(selectedDate).toLocaleDateString()}</strong>
                  </div>
                  <div className="detail-row">
                    <span>Time:</span>
                    <strong>{selectedTime}</strong>
                  </div>
                  <div className="detail-row">
                    <span>Seats:</span>
                    <strong>{selectedSeats.map((s) => s.id).join(", ")}</strong>
                  </div>
                  <div className="detail-row">
                    <span>Total Seats:</span>
                    <strong>{selectedSeats.length}</strong>
                  </div>
                </div>
                <hr />
                <div className="price-row total" style={{ marginBottom: '20px' }}>
                  <strong>Total Amount</strong>
                  <strong>₹{getTotalPrice() + getConvenienceFee()}</strong>
                </div>

                <button
                  onClick={handleConfirmBooking}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(102, 126, 234, 0.4)',
                    transition: 'transform 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Confirm & Pay ₹{getTotalPrice() + getConvenienceFee()}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div >
  );
};

export default ConcertBooking;
