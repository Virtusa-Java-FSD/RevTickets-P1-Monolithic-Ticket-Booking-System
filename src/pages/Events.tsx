import { useState, useEffect } from "react";
import type { Event } from "../types/Event";
import EventCard from "../components/EventCard";
import "../styles/events.css";

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("title");

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      // Mock events data
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
      setEvents(mockEvents);
      setFilteredEvents(mockEvents);
      setError(null);
    } catch (err) {
      setError("Failed to load events. Please try again later.");
      console.error("Error loading events:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort events
  useEffect(() => {
    let result = [...events];

    // Search filter
    if (searchTerm.trim()) {
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter - show only "other" events (not concerts or travel)
    result = result.filter((event) => event.category === "other");
    
    if (selectedCategory !== "all") {
      result = result.filter((event) => event.category === selectedCategory);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "date":
          return new Date(a.releaseDate || "").getTime() - new Date(b.releaseDate || "").getTime();
        case "title":
        default:
          return a.title.localeCompare(b.title);
      }
    });

    setFilteredEvents(result);
  }, [searchTerm, selectedCategory, sortBy, events]);

  // Get unique categories
  const categories = Array.from(new Set(events.map((event) => event.category)));

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted small">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="events-page">
      {/* Compact Header */}
      <div className="bg-gradient" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="container-fluid px-3 py-3 py-md-4">
          <div className="row align-items-center">
            <div className="col-12 col-sm-8">
              <h2 className="text-white mb-1 fw-bold fs-4 fs-md-3">🎪 Events</h2>
              <p className="text-white-50 mb-0 small d-none d-sm-block">Discover amazing events and book your tickets!</p>
            </div>
            <div className="col-12 col-sm-4 text-end mt-2 mt-sm-0">
              <span className="badge bg-white text-primary px-2 px-md-3 py-1 py-md-2 small">
                {filteredEvents.length} Events
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="container-fluid px-3 pt-2">
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError(null)}></button>
          </div>
        </div>
      )}

      {/* Compact Filters */}
      <div className="container-fluid px-3 py-2 py-md-3">
        <div className="row g-2">
          <div className="col-12 col-md-4 mb-2 mb-md-0">
            <div className="input-group input-group-sm">
              <span className="input-group-text">🔍</span>
              <input
                type="text"
                className="form-control"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-6 col-md-4">
            <select
              className="form-select form-select-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="col-6 col-md-4">
            <select
              className="form-select form-select-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="title">Sort by Title</option>
              <option value="rating">Sort by Rating</option>
              <option value="date">Sort by Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="container-fluid px-3 pb-3">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-4">
            <div className="alert alert-info d-inline-block">
              No events found. Try adjusting your filters.
            </div>
          </div>
        ) : (
          <div className="row g-2 g-md-3">
            {filteredEvents.map((event) => (
              <div key={event.id} className="col-6 col-sm-4 col-md-3 col-lg-3 col-xl-2">
                <EventCard event={event} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Us Section */}
      <div className="bg-light py-4">
        <div className="container-fluid px-3">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center">
              <h5 className="mb-3">📞 Need Help?</h5>
              <p className="text-muted mb-2">Contact our support team for any questions about events or bookings</p>
              <div className="d-flex justify-content-center align-items-center gap-3">
                <span className="fw-bold text-primary">📱 +1 (555) 123-4567</span>
                <span className="text-muted">|</span>
                <span className="fw-bold text-primary">📧 support@revtickets.com</span>
              </div>
              <small className="text-muted d-block mt-2">Available 24/7 for customer support</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
