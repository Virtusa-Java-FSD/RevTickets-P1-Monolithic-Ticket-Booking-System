import type { Event } from "../types/Event";
import { useNavigate } from "react-router-dom";
import { useResponsiveImageHeight } from "../hooks/useResponsiveImageHeight";

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();
  const imageHeight = useResponsiveImageHeight();

  const handleBooking = () => {
    navigate(`/events/${event.id}`);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "concert": return "🎵";
      case "travel": return "✈️";
      case "movie": return "🎬";
      default: return "🎪";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "concert": return "bg-success";
      case "travel": return "bg-info";
      case "movie": return "bg-primary";
      default: return "bg-secondary";
    }
  };

  return (
    <div className="card h-100 shadow-sm">
      <img src={event.imageUrl} className="card-img-top" alt={event.title} style={{ height: `${imageHeight}px`, objectFit: "cover" }} />
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title">{event.title}</h5>
          <span className={`badge ${getCategoryColor(event.category)} text-white`}>
            {getCategoryIcon(event.category)} {event.category}
          </span>
        </div>
        <p className="card-text text-muted small">{event.description}</p>
        <div className="mt-auto">
          {event.rating && (
            <div className="mb-2">
              <span className="badge bg-warning text-dark">⭐ {event.rating}/10</span>
            </div>
          )}
          {event.releaseDate && (
            <p className="text-muted small">Date: {new Date(event.releaseDate).toLocaleDateString()}</p>
          )}
        </div>
        <button className="btn btn-primary w-100 mt-3" onClick={handleBooking}>
          Book Now
        </button>
      </div>
    </div>
  );
};

export default EventCard;