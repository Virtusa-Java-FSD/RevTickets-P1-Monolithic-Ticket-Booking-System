import type { Event } from "../types/Event";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();
  const [userRating, setUserRating] = useState<number>(0);
  const [showReview, setShowReview] = useState(false);
  const [review, setReview] = useState("");

  const handleBooking = () => {
    navigate(`/booking/event/${event.id}`);
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

  const handleStarClick = (rating: number) => {
    setUserRating(rating);
  };

  const submitReview = () => {
    // Backend integration point
    console.log('Review submitted:', { eventId: event.id, rating: userRating, review });
    setShowReview(false);
    setReview("");
    setUserRating(0);
  };

  return (
    <div className="card h-100 shadow-hover border-0" style={{ transition: 'all 0.3s ease' }}>
      <div className="position-relative overflow-hidden" style={{ cursor: 'pointer' }} onClick={() => navigate(`/events/${event.id}`)}>
        <img 
          src={event.imageUrl} 
          className="card-img-top" 
          alt={event.title} 
          style={{ height: "200px", transition: 'transform 0.3s ease' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        <span className={`badge ${getCategoryColor(event.category)} position-absolute top-0 end-0 m-2`}>
          {getCategoryIcon(event.category)} {event.category}
        </span>
      </div>
      <div className="card-body p-3 d-flex flex-column">
        <h6 className="card-title fw-bold mb-2">{event.title}</h6>
        <p className="card-text text-muted small mb-2" style={{ fontSize: '0.85rem', lineHeight: '1.3' }}>
          {event.description.length > 80 ? event.description.substring(0, 80) + '...' : event.description}
        </p>
        <div className="d-flex justify-content-between align-items-center mb-2">
          {event.rating && (
            <span className="badge bg-warning text-dark small">⭐ {event.rating}</span>
          )}
          {event.eventDate && (
            <small className="text-muted">{new Date(event.eventDate).toLocaleDateString()}</small>
          )}
        </div>
        {event.location && (
          <p className="text-muted small mb-2">📍 {event.location}</p>
        )}
        {event.seats && (
          <p className="text-muted small mb-2">🎫 {event.seats.toLocaleString()} seats</p>
        )}
        <div className="mt-auto">
          <div className="d-flex justify-content-end mb-2">
            <button 
              className="btn btn-outline-secondary btn-sm" 
              onClick={() => setShowReview(!showReview)}
              title="Add Review"
            >
              ⭐ Review
            </button>
          </div>
          {showReview && (
            <div className="mt-2 p-2 bg-light rounded">
              <div className="d-flex mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`cursor-pointer ${star <= userRating ? 'text-warning' : 'text-muted'}`}
                    onClick={() => handleStarClick(star)}
                    style={{ cursor: 'pointer', fontSize: '1.2rem' }}
                  >
                    ⭐
                  </span>
                ))}
              </div>
              <textarea
                className="form-control form-control-sm mb-2"
                rows={2}
                placeholder="Write your review..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
              <div className="d-flex gap-1">
                <button className="btn btn-success btn-sm" onClick={submitReview}>
                  Submit
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowReview(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        <button className="btn btn-primary w-100 mt-3" onClick={handleBooking}>
          Book Tickets
        </button>
      </div>

    </div>
  );
};

export default EventCard;