import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Event } from "../types/Event";

const Events = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [imageHeight, setImageHeight] = useState(200);

  // Load responsive image sizing
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

  // Load events mock data
  useEffect(() => {
    setLoading(true);

    const mockEvents: Event[] = [
      { id: "e1", title: "Tech Conference 2025", description: "Leading innovations & tech showcases", category: "other", industry: "Technology", rating: 8.5, price: 799, imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400" },
      { id: "e2", title: "Food Festival", description: "Taste cuisines from around the world", category: "other", industry: "Food & Beverage", rating: 8.8, price: 499, imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400" },
      { id: "e3", title: "Art Exhibition", description: "Contemporary art showcase", category: "other", industry: "Arts & Culture", rating: 8.2, price: 350, imageUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400" },
      { id: "e4", title: "Sports Championship", description: "National level finals", category: "other", industry: "Sports", rating: 9.0, price: 999, imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400" },
      { id: "e5", title: "Comedy Night", description: "Stand-up show with top comedians", category: "other", industry: "Entertainment", rating: 8.6, price: 299, imageUrl: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=400" },
      { id: "e6", title: "Book Fair 2024", description: "Meet your favourite authors!", category: "other", industry: "Education", rating: 8.3, price: 150, imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400" },
      { id: "e7", title: "Fashion Week", description: "International fashion show", category: "other", industry: "Fashion", rating: 8.9, price: 1299, imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400" },
      { id: "e8", title: "Gaming Expo", description: "New releases & live tournaments", category: "other", industry: "Technology", rating: 9.1, price: 899, imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400" },
      { id: "e9", title: "Wine Tasting Event", description: "Premium wine experience", category: "other", industry: "Food & Beverage", rating: 8.4, price: 599, imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400" },
      { id: "e10", title: "Startup Summit", description: "Entrepreneurship networking event", category: "other", industry: "Business", rating: 8.7, price: 699, imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400" },
      { id: "e11", title: "Yoga Retreat", description: "Relaxation & wellness weekend", category: "other", industry: "Health & Wellness", rating: 8.5, price: 450, imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400" },
      { id: "e12", title: "Car Show 2024", description: "Luxury & vintage exhibitions", category: "other", industry: "Automotive", rating: 8.8, price: 850, imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400" }
    ];

    setEvents(mockEvents);
    setFilteredEvents(mockEvents);
    setLoading(false);
  }, []);

  // Filter logic
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

    if (sortBy === "rating") list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sortBy === "priceLow") list.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (sortBy === "priceHigh") list.sort((a, b) => (b.price || 0) - (a.price || 0));
    else list.sort((a, b) => a.title.localeCompare(b.title));

    setFilteredEvents(list);
  }, [searchTerm, selectedIndustry, sortBy, events]);

  if (loading) return <h3 className="text-center mt-5">Loading events...</h3>;

  const industries = Array.from(new Set(events.map(e => e.industry)));

  return (
    <div className="events-page">

      {/* HEADER */}
      <div className="py-5 bg-dark text-white">
        <div className="container">
          <button className="btn btn-light btn-sm mb-3" onClick={() => navigate("/")}>
            ← Back
          </button>
          <h1 className="display-4">🎪 Events</h1>
          <p className="lead">Discover amazing events and book your tickets!</p>
        </div>
      </div>

      {/* ⭐ FILTER BAR MATCHING CONCERT STYLE */}
      <div className="container mt-4">
        <div
          className="d-flex align-items-center gap-3 flex-wrap mb-4"
          style={{
            justifyContent: "space-between",
            background: "white",
            padding: "15px 20px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
          }}
        >
          {/* Search */}
          <input
            className="form-control"
            style={{ maxWidth: "280px", borderRadius: "10px" }}
            placeholder="🔍 Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Industry */}
          <select
            className="form-select"
            style={{ maxWidth: "200px", borderRadius: "10px" }}
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
          >
            <option value="all">All Industries</option>
            {industries.map(i => <option key={i}>{i}</option>)}
          </select>

          {/* Sort */}
          <select
            className="form-select"
            style={{ maxWidth: "180px", borderRadius: "10px" }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="title">Sort by Title</option>
            <option value="rating">Sort by Rating</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
          </select>
        </div>

        {/* COUNT */}
        <p className="text-muted mb-3">
          Showing <strong>{filteredEvents.length}</strong> event(s)
        </p>

        {/* EVENT CARDS */}
        <div className="row g-3">
          {filteredEvents.map(event => (
            <div key={event.id} className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-2">
              <div className="card shadow-sm h-100">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="card-img-top"
                  style={{ height: `${imageHeight}px`, objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{event.title}</h5>
                  <p className="small text-muted flex-grow-1">{event.description}</p>

                  <span className="badge bg-warning text-dark mb-2">
                    ⭐ {event.rating}
                  </span>

                  <button
                    className="btn btn-primary mt-auto"
                    onClick={() => navigate(`/booking/event/${event.id}`)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="alert alert-info text-center mt-4">No events found</div>
        )}
      </div>
    </div>
  );
};

export default Events;
