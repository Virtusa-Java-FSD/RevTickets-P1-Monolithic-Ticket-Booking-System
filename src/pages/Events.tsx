import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Event } from "../types/Event";
import AuthModal from "../components/AuthModal";
import "../styles/events.css";
import "../styles/travel.css";

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
    setLoading(true);

    const mockEvents: Event[] = [
      { id: "e1", title: "Tech Conference 2025", description: "Leading innovations & tech showcases", category: "other", industry: "Technology", rating: 4.5, price: 799, imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400" },
      { id: "e2", title: "Food Festival", description: "Taste cuisines from around the world", category: "other", industry: "Food & Beverage", rating: 4.8, price: 499, imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400" },
      { id: "e3", title: "Art Exhibition", description: "Contemporary art showcase", category: "other", industry: "Arts & Culture", rating: 4.2, price: 350, imageUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400" },
      { id: "e4", title: "Sports Championship", description: "National level finals", category: "other", industry: "Sports", rating: 4.9, price: 999, imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400" },
      { id: "e5", title: "Comedy Night", description: "Stand-up show with top comedians", category: "other", industry: "Entertainment", rating: 4.3, price: 299, imageUrl: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=400" },
      { id: "e6", title: "Book Fair 2025", description: "Meet your favourite authors!", category: "other", industry: "Education", rating: 4.1, price: 150, imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400" },
      { id: "e7", title: "Fashion Week", description: "International fashion show", category: "other", industry: "Fashion", rating: 4.7, price: 1299, imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400" },
      { id: "e8", title: "Gaming Expo", description: "New releases & live tournaments", category: "other", industry: "Technology", rating: 5.0, price: 899, imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400" },
      { id: "e9", title: "Wine Tasting Event", description: "Premium wine experience", category: "other", industry: "Food & Beverage", rating: 4.4, price: 599, imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400" },
      { id: "e10", title: "Startup Summit", description: "Entrepreneurship networking event", category: "other", industry: "Business", rating: 4.6, price: 699, imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400" },
      { id: "e11", title: "Yoga Retreat", description: "Relaxation & wellness weekend", category: "other", industry: "Health & Wellness", rating: 4.5, price: 450, imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400" },
      { id: "e12", title: "Car Show 2025", description: "Luxury & vintage exhibitions", category: "other", industry: "Automotive", rating: 4.8, price: 850, imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400" }
    ];

    setEvents(mockEvents);
    setFilteredEvents(mockEvents);
    setLoading(false);
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
    </div>
  );
};

export default Events;