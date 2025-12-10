import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Event } from "../types/Event";
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

  const showTimes = ["5:00 PM", "7:00 PM", "9:00 PM"];
  const availableDates = [
    new Date(Date.now() + 86400000).toISOString().split("T")[0],
    new Date(Date.now() + 172800000).toISOString().split("T")[0],
    new Date(Date.now() + 259200000).toISOString().split("T")[0],
  ];

  useEffect(() => {
    loadConcertDetails();
    generateSeats();
  }, [concertId]);

  const loadConcertDetails = async () => {
    try {
      setLoading(true);
      const mockConcerts: Event[] = [
        {
          id: "c1",
          title: "Ed Sheeran World Tour",
          description: "Experience the magic of Ed Sheeran live in concert",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=400&fit=crop",
          rating: 9.2,
          genres: ["Pop"],
        },
        {
          id: "c2",
          title: "Coldplay Music of the Spheres",
          description: "Coldplay's spectacular world tour with stunning visuals",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=300&h=400&fit=crop",
          rating: 9.5,
          genres: ["Rock"],
        },
        {
          id: "c3",
          title: "AR Rahman Live",
          description: "The Mozart of Madras performs his greatest hits",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=400&fit=crop",
          rating: 9.0,
          genres: ["Classical"],
        },
        {
          id: "c4",
          title: "Arijit Singh Concert",
          description: "Bollywood's favorite voice live in concert",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=400&fit=crop",
          rating: 8.8,
          genres: ["Bollywood"],
        },
        {
          id: "c5",
          title: "Imagine Dragons Evolve Tour",
          description: "Rock the night with Imagine Dragons",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&h=400&fit=crop",
          rating: 8.9,
          genres: ["Rock"],
        },
        {
          id: "c6",
          title: "Dua Lipa Future Nostalgia",
          description: "Pop sensation Dua Lipa's electrifying performance",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&h=400&fit=crop",
          rating: 8.7,
          genres: ["Pop"],
        },
        {
          id: "c7",
          title: "Taylor Swift Eras Tour",
          description: "Journey through all of Taylor's musical eras",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=300&h=400&fit=crop",
          rating: 9.8,
          genres: ["Pop"],
        },
        {
          id: "c8",
          title: "The Weeknd After Hours",
          description: "Experience The Weeknd's electrifying performance",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&h=400&fit=crop",
          rating: 9.1,
          genres: ["Pop", "R&B"],
        },
        {
          id: "c9",
          title: "Metallica World Tour",
          description: "Heavy metal legends live on stage",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&h=400&fit=crop",
          rating: 9.3,
          genres: ["Rock", "Metal"],
        },
        {
          id: "c10",
          title: "Billie Eilish Happier Than Ever",
          description: "Intimate performance by the pop sensation",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=400&fit=crop",
          rating: 8.9,
          genres: ["Pop"],
        },
        {
          id: "c11",
          title: "BTS Permission to Dance",
          description: "K-Pop superstars in an unforgettable show",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=400&fit=crop",
          rating: 9.6,
          genres: ["K-Pop", "Pop"],
        },
        {
          id: "c12",
          title: "Shreya Ghoshal Live",
          description: "Melodious evening with India's nightingale",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=400&fit=crop",
          rating: 8.7,
          genres: ["Bollywood", "Classical"],
        },
        {
          id: "c13",
          title: "Drake It's All a Blur",
          description: "Hip-hop icon's biggest tour yet",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=300&h=400&fit=crop",
          rating: 8.8,
          genres: ["Hip-Hop", "R&B"],
        },
        {
          id: "c14",
          title: "Adele Weekends with Adele",
          description: "Powerful vocals in an intimate setting",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=300&h=400&fit=crop",
          rating: 9.4,
          genres: ["Pop", "Soul"],
        },
        {
          id: "c15",
          title: "Sunidhi Chauhan Live",
          description: "Energetic performance by Bollywood's powerhouse",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=400&fit=crop",
          rating: 8.6,
          genres: ["Bollywood"],
        },
      ];

      const foundConcert = mockConcerts.find((c) => c.id === concertId);
      setConcert(foundConcert || null);
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
            isBooked: Math.random() > 0.7,
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
    
    const bookingData = {
      concertTitle: concert?.title,
      date: selectedDate,
      time: selectedTime,
      seats: selectedSeats.map((s) => s.id).join(", "),
      seatDetails: selectedSeats,
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      convenienceFee: getConvenienceFee(),
      totalAmount: getTotalPrice() + getConvenienceFee()
    };
    
    navigate("/booking-confirmation", { state: bookingData });
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
      <div className="booking-header">
        <div className="container">
          <button className="back-btn" onClick={() => step === 1 ? navigate("/concerts") : setStep(1)}>
            ← {step === 1 ? "Back to Concerts" : "Back to Seat Selection"}
          </button>
          <h1>{concert.title}</h1>
          <p>{concert.description}</p>
        </div>
      </div>

      <div className="container my-4">
        {/* Progress Steps */}
        <div className="booking-steps">
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
                        onClick={() => setSelectedDate(date)}
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
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <h3 className="mt-4">Select Your Seats</h3>
                <div className="category-filter">
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

                <div className="stage-indicator">🎤 STAGE</div>

                <div className="seat-map">
                  {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"].map((row) => (
                    <div key={row} className="seat-row">
                      <span className="row-label">{row}</span>
                      {filteredSeats
                        .filter((s) => s.row === row)
                        .map((seat) => (
                          <button
                            key={seat.id}
                            className={`seat ${seat.category.toLowerCase()} ${
                              seat.isBooked
                                ? "booked"
                                : selectedSeats.find((s) => s.id === seat.id)
                                ? "selected"
                                : ""
                            }`}
                            onClick={() => handleSeatClick(seat)}
                            disabled={seat.isBooked}
                            title={`${seat.id} - ₹${seat.price}`}
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
          <div className="row g-4 mt-3">
            <div className="col-lg-8">
              <div className="booking-card">
                <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#1f2937'}}>Customer Details</h3>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px'}}>
                  <div>
                    <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px'}}>
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
                    <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px'}}>
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
                    <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px'}}>
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

              <div className="booking-card" style={{marginTop: '20px'}}>
                <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#1f2937'}}>Payment Method</h3>
                <div>
                  <label className="payment-method-option">
                    <div className="payment-method-content">
                      <input type="radio" name="payment" id="card" defaultChecked />
                      <div className="payment-method-info">
                        <div className="payment-method-title">💳 Credit/Debit Card</div>
                        <div className="payment-method-subtitle">Visa, Mastercard, Amex</div>
                      </div>
                    </div>
                  </label>
                  <label className="payment-method-option">
                    <div className="payment-method-content">
                      <input type="radio" name="payment" id="upi" />
                      <div className="payment-method-info">
                        <div className="payment-method-title">📱 UPI</div>
                        <div className="payment-method-subtitle">Google Pay, PhonePe, Paytm</div>
                      </div>
                    </div>
                  </label>
                  <label className="payment-method-option">
                    <div className="payment-method-content">
                      <input type="radio" name="payment" id="wallet" />
                      <div className="payment-method-info">
                        <div className="payment-method-title">👛 Wallet</div>
                        <div className="payment-method-subtitle">Amazon Pay, Mobikwik</div>
                      </div>
                    </div>
                  </label>
                  <label className="payment-method-option">
                    <div className="payment-method-content">
                      <input type="radio" name="payment" id="netbanking" />
                      <div className="payment-method-info">
                        <div className="payment-method-title">🏦 Net Banking</div>
                        <div className="payment-method-subtitle">All major banks</div>
                      </div>
                    </div>
                  </label>
                </div>

                <div style={{display: 'flex', gap: '12px', marginTop: '24px'}}>
                  <button 
                    onClick={() => setStep(1)}
                    style={{
                      flex: 1,
                      padding: '14px',
                      background: 'white',
                      color: '#667eea',
                      border: '2px solid #667eea',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    ← Back
                  </button>
                  <button 
                    onClick={handleConfirmBooking}
                    style={{
                      flex: 2,
                      padding: '14px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Confirm & Pay ₹{getTotalPrice() + getConvenienceFee()}
                  </button>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
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
                <div className="price-row total">
                  <strong>Total Amount</strong>
                  <strong>₹{getTotalPrice() + getConvenienceFee()}</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConcertBooking;
