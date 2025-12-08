import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Event } from "../types/Event";

const Booking = () => {
  const { eventId, eventType } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const basePrice = 500;
  const showTimes = ["10:00 AM", "2:00 PM", "6:00 PM", "9:00 PM"];

  useEffect(() => {
    loadEventDetails();
  }, [eventId, eventType]);

  useEffect(() => {
    setTotalPrice(basePrice * ticketQuantity);
  }, [ticketQuantity]);

  const loadEventDetails = async () => {
    try {
      setLoading(true);
      // Mock data - in real app, fetch from API
      const mockEvents: Event[] = [
        // Concerts
        {
          id: "c1",
          title: "Ed Sheeran World Tour",
          description: "Experience the magic of Ed Sheeran live in concert",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=400&fit=crop",
          rating: 9.2,
        },
        {
          id: "c2",
          title: "Coldplay Music of the Spheres",
          description: "Coldplay's spectacular world tour with stunning visuals",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=300&h=400&fit=crop",
          rating: 9.5,
        },
        {
          id: "c3",
          title: "AR Rahman Live",
          description: "The Mozart of Madras performs his greatest hits",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=400&fit=crop",
          rating: 9.0,
        },
        {
          id: "c4",
          title: "Arijit Singh Concert",
          description: "Bollywood's favorite voice live in concert",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=400&fit=crop",
          rating: 8.8,
        },
        {
          id: "c5",
          title: "Imagine Dragons Evolve Tour",
          description: "Rock the night with Imagine Dragons",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&h=400&fit=crop",
          rating: 8.9,
        },
        {
          id: "c6",
          title: "Dua Lipa Future Nostalgia",
          description: "Pop sensation Dua Lipa's electrifying performance",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&h=400&fit=crop",
          rating: 8.7,
        },
        // Movies
        {
          id: "1",
          title: "Inception",
          description: "A thief who steals corporate secrets through dream-sharing technology.",
          category: "movie",
          imageUrl: "https://via.placeholder.com/300x400?text=Inception",
          rating: 8.8,
        },
        {
          id: "2",
          title: "The Dark Knight",
          description: "When the menace known as the Joker wreaks havoc on Gotham.",
          category: "movie",
          imageUrl: "https://via.placeholder.com/300x400?text=Dark+Knight",
          rating: 9.0,
        },
        // Events
        {
          id: "1",
          title: "Rock Concert 2024",
          description: "Experience the ultimate rock music festival with top bands.",
          category: "event",
          imageUrl: "https://via.placeholder.com/300x250?text=Rock+Concert",
          rating: 9.2,
        }
      ];
      
      const foundEvent = mockEvents.find(e => e.id === eventId);
      setEvent(foundEvent || null);
    } catch (err) {
      console.error("Error loading event:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select date and time");
      return;
    }
    
    // Mock booking process
    alert(`Booking confirmed!\nEvent: ${event?.title}\nDate: ${selectedDate}\nTime: ${selectedTime}\nTickets: ${ticketQuantity}\nTotal: ₹${totalPrice + 50}`);
    navigate("/dashboard");
  };

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

  if (!event) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">Event not found</div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="container-fluid">
        <div className="booking-header py-4 bg-primary text-white">
          <div className="container">
            <button className="btn btn-light btn-sm mb-3" onClick={() => navigate(-1)}>
              ← Back
            </button>
            <h1 className="h3 mb-2">Book Tickets</h1>
            <p className="mb-0">{event.title}</p>
          </div>
        </div>

        <div className="container mt-4 mb-5">
          <div className="row g-4">
            {/* Event Details */}
            <div className="col-12 col-lg-4">
              <div className="card">
                <img src={event.imageUrl} className="card-img-top" alt={event.title} style={{ height: "300px", objectFit: "cover" }} />
                <div className="card-body">
                  <h5 className="card-title">{event.title}</h5>
                  <p className="card-text text-muted small">{event.description}</p>
                  {event.rating && (
                    <span className="badge bg-warning text-dark">⭐ {event.rating}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="col-12 col-lg-8">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title mb-4">Select Date & Time</h5>
                  
                  <div className="row g-3">
                    {/* Date Selection */}
                    <div className="col-12 col-sm-6">
                      <label className="form-label">Select Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    {/* Time Selection */}
                    <div className="col-12 col-sm-6">
                      <label className="form-label">Select Time</label>
                      <select
                        className="form-select"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                      >
                        <option value="">Choose time</option>
                        {showTimes.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>

                    {/* Ticket Quantity */}
                    <div className="col-12 col-sm-6">
                      <label className="form-label">Number of Tickets</label>
                      <select
                        className="form-select"
                        value={ticketQuantity}
                        onChange={(e) => setTicketQuantity(Number(e.target.value))}
                      >
                        {[1,2,3,4,5,6,7,8,9,10].map(num => (
                          <option key={num} value={num}>{num} Ticket{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>

                    {/* Price Summary */}
                    <div className="col-12">
                      <div className="card bg-light">
                        <div className="card-body">
                          <h6 className="card-title">Price Summary</h6>
                          <div className="d-flex justify-content-between">
                            <span>Ticket Price (₹{basePrice} x {ticketQuantity})</span>
                            <span>₹{basePrice * ticketQuantity}</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Booking Fee</span>
                            <span>₹50</span>
                          </div>
                          <hr />
                          <div className="d-flex justify-content-between fw-bold">
                            <span>Total Amount</span>
                            <span>₹{totalPrice + 50}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Book Button */}
                    <div className="col-12">
                      <button
                        className="btn btn-primary btn-lg w-100"
                        onClick={handleBooking}
                        disabled={!selectedDate || !selectedTime}
                      >
                        Book Now - ₹{totalPrice + 50}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;