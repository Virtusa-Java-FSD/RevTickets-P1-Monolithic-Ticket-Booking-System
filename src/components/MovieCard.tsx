import type { Event } from "../types/Event";
import { useNavigate } from "react-router-dom";
import { useResponsiveImageHeight } from "../hooks/useResponsiveImageHeight";

interface MovieCardProps {
  movie: Event;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const navigate = useNavigate();
  const imageHeight = useResponsiveImageHeight();

  const handleBooking = () => {
    navigate(`/booking/movie/${movie.id}`);
  };

  return (
    <div className="card h-100 shadow-sm">
      <img src={movie.imageUrl} className="card-img-top" alt={movie.title} style={{ height: `${imageHeight}px` }} />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{movie.title}</h5>
        <p className="card-text text-muted small">{movie.description}</p>
        <div className="mt-auto">
          {movie.rating && (
            <div className="mb-2">
              <span className="badge bg-warning text-dark">⭐ {movie.rating}/10</span>
            </div>
          )}
          {movie.duration && (
            <p className="text-muted small">Duration: {movie.duration} mins</p>
          )}
          {movie.language && (
            <p className="text-muted small">Language: {movie.language}</p>
          )}
        </div>
        <button className="btn btn-primary w-100 mt-3" onClick={handleBooking}>
          Book Tickets
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
