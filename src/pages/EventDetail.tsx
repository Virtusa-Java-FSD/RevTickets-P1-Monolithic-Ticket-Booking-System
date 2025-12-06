import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Event } from "../types/Event";

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [tickets, setTickets] = useState(1);

  useEffect(() => {
    loadEventDetail();
  }, [eventId]);

  useEffect(() => {
    if (event?.eventDate) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const eventTime = new Date(event.eventDate!).getTime();
        const distance = eventTime - now;

        if (distance > 0) {
          setCountdown({
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000)
          });
        } else {
          setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [event]);

  const loadEventDetail = () => {
    // Same mock event data as Events page
    const mockEvents: Event[] = [
      {
        id: "1",
        title: "Tech Summit 2024: AI & Future",
        description: "Join industry leaders and innovators for the biggest tech conference of the year. Explore cutting-edge AI technologies, machine learning breakthroughs, and the future of digital transformation.",
        category: "other",
        imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
        rating: 9.4,
        releaseDate: "2024-12-15",
        eventDate: "2025-06-15T09:00:00Z",
        location: "San Francisco Convention Center, CA",
        seats: 2500,
        speakers: 12,
        price: 299
      },
      {
        id: "2",
        title: "Startup Pitch Competition",
        description: "Watch the next generation of entrepreneurs pitch their innovative ideas to top investors. Network with founders, VCs, and industry experts.",
        category: "other",
        imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop",
        rating: 8.9,
        releaseDate: "2024-12-08",
        eventDate: "2025-06-08T10:00:00Z",
        location: "Austin Convention Center, TX",
        seats: 800,
        speakers: 15,
        price: 89
      },
      {
        id: "3",
        title: "Digital Art & NFT Expo",
        description: "Explore the intersection of art and technology. Discover groundbreaking digital artworks, meet renowned NFT artists, and learn about blockchain in creative industries.",
        category: "other",
        imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop",
        rating: 8.7,
        releaseDate: "2024-12-25",
        eventDate: "2025-06-25T11:00:00Z",
        location: "Los Angeles Convention Center, CA",
        seats: 3000,
        speakers: 20,
        price: 75
      },
      {
        id: "4",
        title: "Food & Wine Festival",
        description: "Indulge in exquisite culinary experiences with world-class chefs and premium wines. Cooking demonstrations, wine tastings, and gourmet dining.",
        category: "other",
        imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
        rating: 9.1,
        releaseDate: "2024-12-12",
        eventDate: "2025-06-12T16:00:00Z",
        location: "Napa Valley, CA",
        seats: 1200,
        speakers: 6,
        price: 185
      },
      {
        id: "5",
        title: "Wellness & Mindfulness Retreat",
        description: "Reconnect with yourself through meditation, yoga, and holistic wellness practices. Expert-led sessions in the serene landscapes of Sedona.",
        category: "other",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        rating: 9.3,
        releaseDate: "2024-12-18",
        eventDate: "2025-06-18T08:00:00Z",
        location: "Sedona Retreat Center, AZ",
        seats: 500,
        speakers: 10,
        price: 220
      },
      {
        id: "6",
        title: "Gaming Championship 2024",
        description: "Watch the world's best gamers compete in the ultimate esports championship. Multiple game tournaments, live streaming, and exclusive gaming gear.",
        category: "other",
        imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop",
        rating: 8.8,
        releaseDate: "2024-12-22",
        eventDate: "2025-06-22T12:00:00Z",
        location: "Las Vegas Arena, NV",
        seats: 8000,
        speakers: 4,
        price: 65
      },
      {
        id: "7",
        title: "Sustainable Future Summit",
        description: "Leading environmental scientists, policy makers, and activists discuss climate solutions, renewable energy, and sustainable business practices.",
        category: "other",
        imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
        rating: 9.0,
        releaseDate: "2024-12-10",
        eventDate: "2025-06-10T09:30:00Z",
        location: "Seattle Convention Center, WA",
        seats: 1800,
        speakers: 18,
        price: 95
      },
      {
        id: "8",
        title: "Comedy Night Spectacular",
        description: "Laugh out loud with the best comedians performing hilarious stand-up routines. An evening of non-stop entertainment and humor.",
        category: "other",
        imageUrl: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&h=600&fit=crop",
        rating: 8.5,
        releaseDate: "2024-12-14",
        eventDate: "2025-06-14T20:00:00Z",
        location: "Chicago Theater, IL",
        seats: 1500,
        speakers: 8,
        price: 55
      }
    ];

    const foundEvent = mockEvents.find(e => e.id === eventId);
    setEvent(foundEvent || null);
    setLoading(false);
  };

  const handleBooking = () => {
    if (!event) return;
    
    const bookingData = {
      eventId: event.id,
      eventTitle: event.title,
      tickets: tickets,
      price: event.price || 50,
      date: new Date(event.eventDate || '').toLocaleDateString(),
      category: event.category
    };
    
    navigate('/payment', { state: { bookingData } });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container py-5 text-center">
        <h3>Event not found</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/events')}>
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="event-detail-page">
      {/* Hero Section */}
      <div className="hero-section position-relative" style={{ height: '70vh', overflow: 'hidden' }}>
        <img 
          src={event.imageUrl} 
          alt={event.title}
          className="w-100 h-100 object-fit-cover position-absolute"
          style={{ objectFit: 'cover' }}
        />
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'rgba(0,0,0,0.6)' }}></div>
        
        <div className="position-absolute top-50 start-50 translate-middle text-center text-white w-100 px-3">
          <h1 className="display-4 fw-bold mb-3">{event.title}</h1>
          <div className="row justify-content-center mb-4">
            <div className="col-auto">
              <div className="d-flex align-items-center mb-2">
                <span className="me-2">📅</span>
                <span>{new Date(event.eventDate || '').toLocaleDateString()}</span>
              </div>
            </div>
            <div className="col-auto">
              <div className="d-flex align-items-center mb-2">
                <span className="me-2">📍</span>
                <span>{event.location}</span>
              </div>
            </div>
          </div>
          
          <div className="row justify-content-center mb-4">
            <div className="col-auto">
              <div className="bg-white bg-opacity-10 rounded p-2 mx-2">
                <div className="fw-bold">{event.seats?.toLocaleString()}</div>
                <small>Seats</small>
              </div>
            </div>
            <div className="col-auto">
              <div className="bg-white bg-opacity-10 rounded p-2 mx-2">
                <div className="fw-bold">{event.speakers}</div>
                <small>Speakers</small>
              </div>
            </div>
            <div className="col-auto">
              <div className="bg-white bg-opacity-10 rounded p-2 mx-2">
                <div className="fw-bold">${event.price}</div>
                <small>Price</small>
              </div>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="countdown-timer mb-4">
            <h4 className="mb-3">Event Starts In:</h4>
            <div className="row justify-content-center">
              <div className="col-auto">
                <div className="bg-primary rounded p-3 mx-1">
                  <div className="h2 mb-0">{countdown.days}</div>
                  <small>Days</small>
                </div>
              </div>
              <div className="col-auto">
                <div className="bg-primary rounded p-3 mx-1">
                  <div className="h2 mb-0">{countdown.hours}</div>
                  <small>Hours</small>
                </div>
              </div>
              <div className="col-auto">
                <div className="bg-primary rounded p-3 mx-1">
                  <div className="h2 mb-0">{countdown.minutes}</div>
                  <small>Minutes</small>
                </div>
              </div>
              <div className="col-auto">
                <div className="bg-primary rounded p-3 mx-1">
                  <div className="h2 mb-0">{countdown.seconds}</div>
                  <small>Seconds</small>
                </div>
              </div>
            </div>
          </div>

          <button className="btn btn-success btn-lg px-5" onClick={handleBooking}>
            Book Now - ${event.price}
          </button>
        </div>
      </div>

      {/* Event Details */}
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-8">
            <h3 className="mb-4">About This Event</h3>
            <p className="lead">{event.description}</p>
            
            <div className="row mt-5">
              <div className="col-md-6">
                <h5>Event Details</h5>
                <ul className="list-unstyled">
                  <li className="mb-2"><strong>Date:</strong> {new Date(event.eventDate || '').toLocaleDateString()}</li>
                  <li className="mb-2"><strong>Time:</strong> {new Date(event.eventDate || '').toLocaleTimeString()}</li>
                  <li className="mb-2"><strong>Location:</strong> {event.location}</li>
                  <li className="mb-2"><strong>Category:</strong> {event.category}</li>
                </ul>
              </div>
              <div className="col-md-6">
                <h5>Capacity & Pricing</h5>
                <ul className="list-unstyled">
                  <li className="mb-2"><strong>Total Seats:</strong> {event.seats?.toLocaleString()}</li>
                  <li className="mb-2"><strong>Speakers:</strong> {event.speakers}</li>
                  <li className="mb-2"><strong>Price:</strong> ${event.price}</li>
                  <li className="mb-2"><strong>Rating:</strong> ⭐ {event.rating}/10</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Quick Booking</h5>
                <div className="mb-3">
                  <label className="form-label">Number of Tickets</label>
                  <select 
                    className="form-select" 
                    value={tickets} 
                    onChange={(e) => setTickets(Number(e.target.value))}
                  >
                    {[1,2,3,4,5,6,7,8].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between">
                    <span>Price per ticket:</span>
                    <span>${event.price}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Quantity:</span>
                    <span>{tickets}</span>
                  </div>
                  <hr/>
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Total:</span>
                    <span>${(event.price || 0) * tickets}</span>
                  </div>
                </div>
                <button className="btn btn-primary w-100" onClick={handleBooking}>
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;