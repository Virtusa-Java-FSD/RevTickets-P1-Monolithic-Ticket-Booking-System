import { useState, useEffect } from "react";
import type { Event } from "../types/Event";
import EventCard from "../components/EventCard";

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
          title: "Rock Concert 2024",
          description: "Experience the ultimate rock music festival with top bands.",
          category: "concert",
          imageUrl: "https://via.placeholder.com/300x250?text=Rock+Concert",
          rating: 9.2,
          releaseDate: "2024-06-15",
        },
        {
          id: "2",
          title: "Jazz Night",
          description: "An intimate evening of smooth jazz and soulful melodies.",
          category: "concert",
          imageUrl: "https://via.placeholder.com/300x250?text=Jazz+Night",
          rating: 8.7,
          releaseDate: "2024-05-20",
        },
        {
          id: "3",
          title: "Paris Adventure",
          description: "Explore the city of lights with our exclusive travel package.",
          category: "travel",
          imageUrl: "https://via.placeholder.com/300x250?text=Paris+Travel",
          rating: 9.5,
          releaseDate: "2024-07-01",
        },
        {
          id: "4",
          title: "Tokyo Experience",
          description: "Discover the blend of tradition and modernity in Japan.",
          category: "travel",
          imageUrl: "https://via.placeholder.com/300x250?text=Tokyo+Travel",
          rating: 9.1,
          releaseDate: "2024-08-10",
        },
        {
          id: "5",
          title: "Comedy Show",
          description: "Laugh out loud with the best comedians in town.",
          category: "other",
          imageUrl: "https://via.placeholder.com/300x250?text=Comedy+Show",
          rating: 8.3,
          releaseDate: "2024-04-25",
        },
        {
          id: "6",
          title: "Art Exhibition",
          description: "Contemporary art showcase featuring local and international artists.",
          category: "other",
          imageUrl: "https://via.placeholder.com/300x250?text=Art+Exhibition",
          rating: 8.9,
          releaseDate: "2024-05-05",
        },
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

    // Category filter
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
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="events-page">
      <div className="container-fluid">
        {/* Header */}
        <div className="events-header py-5 bg-dark text-white">
          <div className="container">
            <h1 className="display-4 mb-2">🎪 Events</h1>
            <p className="lead">Discover amazing events and book your tickets!</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show m-4" role="alert">
            {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError(null)}
            ></button>
          </div>
        )}

        {/* Filters */}
        <div className="container mt-4 mb-5">
          <div className="row g-3">
            {/* Search */}
            <div className="col-md-6 col-lg-4">
              <input
                type="text"
                className="form-control"
                placeholder="🔍 Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="col-md-6 col-lg-4">
              <select
                className="form-select"
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

            {/* Sort */}
            <div className="col-md-6 col-lg-4">
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="title">Sort by Title</option>
                <option value="rating">Sort by Rating (High to Low)</option>
                <option value="date">Sort by Date</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="container mb-5">
          {filteredEvents.length === 0 ? (
            <div className="alert alert-info text-center py-5">
              <p className="mb-0">No events found. Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <p className="text-muted mb-4">
                Showing <strong>{filteredEvents.length}</strong> event{filteredEvents.length !== 1 ? "s" : ""}
              </p>
              <div className="row g-4">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="col-sm-6 col-md-4 col-lg-3">
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
