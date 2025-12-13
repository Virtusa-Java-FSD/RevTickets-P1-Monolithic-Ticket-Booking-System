import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Event } from "../types/Event";

const basePrice = 500;
const showTimes = ["10:00 AM", "2:00 PM", "6:00 PM", "9:00 PM"];

const Booking = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [ticketQuantity, setTicketQuantity] = useState(1);

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]); // dynamically booked
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");

  /* -------------------- DATES -------------------- */
  const eventDates = Array.from({ length: 7 }, (_, i) =>
    new Date(Date.now() + (i + 1) * 86400000).toDateString()
  );

  useEffect(() => {
    setLoading(true);

    const mockEvents: Event[] = [
      {
        id: "e1",
        title: "Tech Conference 2024",
        description: "Annual technology conference with industry leaders",
        category: "other",
        rating: 8.5,
        imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=400&fit=crop",
      },
      {
        id: "e2",
        title: "Food Festival",
        description: "Explore cuisines from around the world",
        category: "other",
        rating: 8.8,
        imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=400&fit=crop",
      },
      {
        id: "e3",
        title: "Art Exhibition",
        description: "Contemporary art showcase featuring local artists",
        category: "other",
        rating: 8.2,
        imageUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=300&h=400&fit=crop",
      },
      {
        id: "e4",
        title: "Sports Championship",
        description: "National sports championship finals",
        category: "other",
        rating: 9.0,
        imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&h=400&fit=crop",
      },
      {
        id: "e5",
        title: "Comedy Night",
        description: "Stand-up comedy with top comedians",
        category: "other",
        rating: 8.6,
        imageUrl: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=300&h=400&fit=crop",
      },
      {
        id: "e6",
        title: "Book Fair 2024",
        description: "Largest book fair with authors & publishers",
        category: "other",
        rating: 8.3,
        imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
      },
      {
        id: "e7",
        title: "Fashion Week",
        description: "International fashion week showcasing trends",
        category: "other",
        rating: 8.9,
        imageUrl: "https://images.unsplash.com/photo-1558769132-cb1aea3c8565?w=300&h=400&fit=crop",
      },
      {
        id: "e8",
        title: "Gaming Expo",
        description: "Biggest gaming convention with new releases",
        category: "other",
        rating: 9.1,
        imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=400&fit=crop",
      },
      {
        id: "e9",
        title: "Wine Tasting Event",
        description: "Premium wine tasting",
        category: "other",
        rating: 8.4,
        imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&h=400&fit=crop",
      },
      {
        id: "e10",
        title: "Startup Summit",
        description: "Connect with entrepreneurs & investors",
        category: "other",
        rating: 8.7,
        imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=300&h=400&fit=crop",
      },
      {
        id: "e11",
        title: "Yoga Retreat",
        description: "Weekend wellness retreat",
        category: "other",
        rating: 8.5,
        imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=400&fit=crop",
      },
      {
        id: "e12",
        title: "Car Show 2024",
        description: "Luxury and vintage car show",
        category: "other",
        rating: 8.8,
        imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300&h=400&fit=crop",
      },
    ];


    setEvent(mockEvents.find((e) => e.id === eventId) || null);
    setLoading(false);
  }, [eventId]);

  /* -------------------- SEATS -------------------- */
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
  const cols = ["1", "2", "3", "4", "5", "6", "7", "8"];

  const seatId = (r: string, c: string) => `${r}${c}`;

  const toggleSeat = (id: string) => {
    if (bookedSeats.includes(id)) return;

    if (selectedSeats.includes(id)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== id));
    } else if (selectedSeats.length < ticketQuantity) {
      setSelectedSeats([...selectedSeats, id]);
    }
  };

  /* -------------------- BOOKING -------------------- */
  const handleBooking = () => {
    if (!selectedDate || !selectedTime)
      return alert("Please select date & time.");

    if (selectedSeats.length !== ticketQuantity)
      return alert(`Select ${ticketQuantity} seat(s).`);

    // Redirect to Generic Payment Page
    navigate('/payment', {
      state: {
        total: basePrice * ticketQuantity + 50,
        seats: selectedSeats,
        bookingType: 'EVENT',
        eventId: event?.id, // Use eventId
        event: event,
        showId: null // Not a movie show
      }
    });
  };

  // Deprecated internal payment handler
  const handlePayment = () => {
    // ... logic moved to handleBooking redirection
  };

  /* -------------------- UI -------------------- */

  if (loading) return <h3 className="text-center mt-5">Loading...</h3>;
  if (!event) return <h3 className="text-center mt-5 text-danger">Event Not Found</h3>;

  return (
    <>
      <div style={{ minHeight: "100vh", padding: 20, background: "#f6f6fa" }}>
        {/* HEADER */}
        <div
          style={{
            background: "linear-gradient(135deg,#667eea,#764ba2)",
            padding: 15,
            color: "white",
            borderRadius: 10,
            marginBottom: 20,
          }}
        >
          <button onClick={() => navigate(-1)} className="btn btn-light btn-sm mb-2">
            ← Back
          </button>
          <h4 className="m-0">🎟️ {event.title}</h4>
        </div>

        {/* MAIN LAYOUT */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.3fr",
            gap: 20,
          }}
        >
          {/* -------------------- LEFT CARD -------------------- */}
          <div className="card shadow-sm" style={{ padding: 20, borderRadius: 12 }}>
            <h5 className="fw-bold text-primary mb-3">Booking Details</h5>

            <label className="fw-semibold">Select Date</label>
            <select
              className="form-select mb-3"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              <option value="">Choose Date</option>
              {eventDates.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>

            <label className="fw-semibold">Select Time</label>
            <select
              className="form-select mb-3"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            >
              <option value="">Choose Time</option>
              {showTimes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>

            <label className="fw-semibold">Number of Tickets</label>
            <input
              type="number"
              className="form-control mb-3"
              min="1"
              max="10"
              value={ticketQuantity}
              onChange={(e) => {
                const val = Math.min(10, Math.max(1, +e.target.value));
                setTicketQuantity(val);
                setSelectedSeats([]);
              }}
            />

            <button
              className="btn btn-success w-100 fw-bold"
              disabled={!selectedDate || !selectedTime}
              onClick={handleBooking}
            >
              Confirm Booking – ₹{basePrice * ticketQuantity + 50}
            </button>
          </div>

          {/* -------------------- RIGHT SEAT GRID -------------------- */}
          <div className="card shadow-sm" style={{ padding: 20, borderRadius: 12 }}>
            {/* STAGE BAR */}
            <div className="text-center mb-3">
              <div
                style={{
                  background: "#e8e6e3",
                  padding: 12,
                  borderRadius: 8,
                  width: "60%",
                  margin: "0 auto",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                STAGE
              </div>
            </div>

            <h6 className="text-center fw-bold mb-3">
              Select Seats ({selectedSeats.length}/{ticketQuantity})
            </h6>

            {/* SEAT STRUCTURE */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 20px 1fr",
                alignItems: "start",
              }}
            >
              {/* LEFT SECTION */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 5 }}>
                {rows.map((r) =>
                  cols.slice(0, 4).map((c) => {
                    const id = seatId(r, c);
                    const isBooked = bookedSeats.includes(id);
                    const isSelected = selectedSeats.includes(id);

                    return (
                      <button
                        key={id}
                        disabled={isBooked}
                        onClick={() => toggleSeat(id)}
                        style={{
                          padding: "5px 0",
                          fontSize: "0.72rem",
                          borderRadius: 4,
                          background: isBooked
                            ? "#d9534f"
                            : isSelected
                              ? "#10b981"
                              : "white",
                          color: isBooked || isSelected ? "white" : "black",
                          border: "1px solid #ccc",
                        }}
                      >
                        {id}
                      </button>
                    );
                  })
                )}
              </div>

              {/* AISLE */}
              <div></div>

              {/* RIGHT SECTION */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 5 }}>
                {rows.map((r) =>
                  cols.slice(4, 8).map((c) => {
                    const id = seatId(r, c);
                    const isBooked = bookedSeats.includes(id);
                    const isSelected = selectedSeats.includes(id);

                    return (
                      <button
                        key={id}
                        disabled={isBooked}
                        onClick={() => toggleSeat(id)}
                        style={{
                          padding: "5px 0",
                          fontSize: "0.72rem",
                          borderRadius: 4,
                          background: isBooked
                            ? "#d9534f"
                            : isSelected
                              ? "#10b981"
                              : "white",
                          color: isBooked || isSelected ? "white" : "black",
                          border: "1px solid #ccc",
                        }}
                      >
                        {id}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* -------------- LEGEND (RED / GREEN / WHITE) ---------------- */}
            <div
              style={{
                marginTop: 20,
                display: "flex",
                justifyContent: "center",
                gap: 25,
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    width: 15,
                    height: 15,
                    background: "#d9534f",
                    borderRadius: 3,
                    border: "1px solid #aaa",
                    display: "inline-block",
                  }}
                ></span>
                Booked
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    width: 15,
                    height: 15,
                    background: "#10b981",
                    borderRadius: 3,
                    border: "1px solid #aaa",
                    display: "inline-block",
                  }}
                ></span>
                Selected
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    width: 15,
                    height: 15,
                    background: "white",
                    borderRadius: 3,
                    border: "1px solid #aaa",
                    display: "inline-block",
                  }}
                ></span>
                Available
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {showPayment && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="card" style={{ width: '400px', padding: '30px', borderRadius: '12px' }}>
            <h5 className="fw-bold mb-3">Select Payment Method</h5>
            <div className="mb-3">
              <label className="d-flex align-items-center p-3 border rounded mb-2" style={{ cursor: 'pointer' }}>
                <input type="radio" name="payment" value="UPI" onChange={(e) => setPaymentMethod(e.target.value)} className="me-2" />
                <span>💳 UPI</span>
              </label>
              <label className="d-flex align-items-center p-3 border rounded mb-2" style={{ cursor: 'pointer' }}>
                <input type="radio" name="payment" value="Card" onChange={(e) => setPaymentMethod(e.target.value)} className="me-2" />
                <span>💳 Credit/Debit Card</span>
              </label>
              <label className="d-flex align-items-center p-3 border rounded mb-2" style={{ cursor: 'pointer' }}>
                <input type="radio" name="payment" value="Net Banking" onChange={(e) => setPaymentMethod(e.target.value)} className="me-2" />
                <span>🏦 Net Banking</span>
              </label>
              <label className="d-flex align-items-center p-3 border rounded" style={{ cursor: 'pointer' }}>
                <input type="radio" name="payment" value="Wallet" onChange={(e) => setPaymentMethod(e.target.value)} className="me-2" />
                <span>👛 Wallet</span>
              </label>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-secondary flex-1" onClick={() => setShowPayment(false)}>Cancel</button>
              <button className="btn btn-success flex-1" onClick={handlePayment}>Pay ₹{basePrice * ticketQuantity + 50}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Booking;
