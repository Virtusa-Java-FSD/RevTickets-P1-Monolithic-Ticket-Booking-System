import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Event } from "../types/Event";
import EventCard from "../components/EventCard";
import { getEvents } from "../utils/api";
import "../styles/events.css";

const Events = () => {
  const navigate = useNavigate();
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
      const data = await getEvents();
      setEvents(data);
      setFilteredEvents(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load events. Please try again later.");
      console.error("Error loading events:", err);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    let result = [...events];

 
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
        <div className="events-header py-5 bg-dark text-white">
          <div className="container">
            <button className="btn btn-light btn-sm mb-4" onClick={() => navigate('/')}>
              ← Back
            </button>
            <h1 className="display-4 mb-2">🎪 Events</h1>
            <p className="lead">Discover amazing events and book your tickets!</p>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger alert-dismissible fade show m-4" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError(null)}></button>
          </div>
        )}

        <div className="container mt-4 mb-5">
          <div className="row g-2 g-sm-3">
            <div className="col-12 col-sm-6 col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="🔍 Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-6 col-sm-3 col-md-4">
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
            <div className="col-6 col-sm-3 col-md-4">
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
              <div className="row g-2 g-sm-3 g-md-4">
            {filteredEvents.map((event) => (
              <div key={event.id} className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-2">
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
