import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Event } from "../types/Event";
import AuthModal from "../components/AuthModal";
import "../styles/events.css";
import "../styles/travel.css";
import Footer from "../components/Footer";

const Events = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [imageHeight, setImageHeight] = useState(200);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Handle responsive image height
  useEffect(() => {
    const updateHeight = () => {
      if (window.innerWidth < 576) setImageHeight(150);
      else if (window.innerWidth < 768) setImageHeight(180);
      else setImageHeight(200);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  // Load events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const { getEvents } = await import("../utils/api");
        const data = await getEvents();

        // Filter for events that are NOT movies, concerts or travels if necessary
        // Adjust based on your backend data strategy. 
        // For now, we assume getEvents returns general events.
        // If the backend returns everything mixed, we might filter.
        // Based on Event.java, there is 'category'.

        // Ensure data is array
        const eventsList = Array.isArray(data) ? data : [];
        setEvents(eventsList);
        setFilteredEvents(eventsList);
      } catch (error) {
        console.error("Failed to load events:", error);
        // Fallback to empty or keep loading false
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter Logic
  useEffect(() => {
    let list = [...events];

    if (searchTerm.trim()) {
      list = list.filter(
        e =>
          e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedIndustry !== "all") {
      list = list.filter(e => e.industry === selectedIndustry);
    }

    if (sortBy === "rating") list.sort((a, b) => (b.rating! - a.rating!));
    else if (sortBy === "priceLow") list.sort((a, b) => (a.price! - b.price!));
    else if (sortBy === "priceHigh") list.sort((a, b) => (b.price! - a.price!));
    else list.sort((a, b) => a.title.localeCompare(b.title));

    setFilteredEvents(list);
  }, [searchTerm, selectedIndustry, sortBy, events]);

  const checkAuthAndProceed = (callback: () => void) => {
    const authData = localStorage.getItem('rev_auth');
    if (!authData) {
      setShowAuthModal(true);
      return;
    }
    callback();
  };

  const handleAuthModalLogin = () => {
    setShowAuthModal(false);
    navigate('/login');
  };

  if (loading) return <h3 className="text-center mt-5">Loading events...</h3>;

  const industries = Array.from(new Set(events.map(e => e.industry)));

  return (
    <div className="travels-page">
      <div className="container-fluid p-0">
        {/* Banner Carousel */}
        <div className="banner-carousel">
          <div className="banner-slide active" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)' }}>
            <div className="banner-overlay"></div>
            <div className="banner-content">
              <div className="container">
                <h2 className="text-white display-5 fw-bold">🎪 Events</h2>
                <p className="text-white-50">Discover amazing events and book your tickets!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="travels-header py-4 bg-dark text-white">
          <div className="container">
            <h1 className="h3 mb-1">Event Booking</h1>
            <p className="mb-0 small">Book tickets for amazing events at best prices!</p>
          </div>
        </div>

        <div className="container">
          <div className="compact-filter-bar">
            <input
              className="city-input"
              placeholder="🔍 Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="city-input"
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
            >
              <option value="all">All Industries</option>
              {industries.map(i => <option key={i}>{i}</option>)}
            </select>
            <select
              className="city-input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="title">Sort by Title</option>
              <option value="rating">Sort by Rating</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="container mb-5" style={{ marginTop: '20px' }}>
          <p className="text-muted mb-4">
            Showing <strong>{filteredEvents.length}</strong> event{filteredEvents.length !== 1 ? "s" : ""}
          </p>
          <div className="row g-2">
            {filteredEvents.map((event) => (
              <div key={event.id} style={{ flex: '0 0 20%', maxWidth: '20%', padding: '0 0.25rem' }}>
                <div className="travel-card">
                  <div className="travel-image-wrapper">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="travel-image"
                    />
                    <div className="travel-overlay">
                      <div className="overlay-content">
                        <button
                          className="book-btn"
                          onClick={() => checkAuthAndProceed(() => navigate(`/booking/event/${event.id}`))}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                    {event.rating && (
                      <div className="rating-badge">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="#fbbf24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span>{event.rating}/5</span>
                      </div>
                    )}
                  </div>
                  <div className="travel-info">
                    <h3 className="travel-title">{event.title}</h3>
                    <div className="travel-meta">
                      <span className="service-type">{event.industry}</span>
                    </div>
                    <div className="travel-timing">
                      {event.description}
                    </div>
                    <div className="travel-price">₹{event.price} onwards</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredEvents.length === 0 && (
            <div className="alert alert-info text-center py-5">
              <p className="mb-0">No events found. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleAuthModalLogin}
      />
      <Footer />
    </div>
  );
};

export default Events;