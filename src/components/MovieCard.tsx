import type { Event } from "../types/Event";
import { useNavigate } from "react-router-dom";

interface MovieCardProps {
  movie: Event;
  onDetailClick?: (movie: Event) => void;
  onBookClick?: (movie: Event) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  onDetailClick, 
  onBookClick
}) => {
  const navigate = useNavigate();

  const handleBooking = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBookClick) {
      onBookClick(movie);
    } else {
      navigate(`/movie/${movie.id}`);
    }
  };

  const handleCardClick = () => {
    if (onDetailClick) {
      onDetailClick(movie);
    } else {
      navigate(`/movie/${movie.id}`);
    }
  };

  return (
    <div className="movie-card" onClick={handleCardClick}>
      <div className="movie-poster-wrapper">
        <img 
          src={movie.imageUrl} 
          alt={movie.title}
          className="movie-poster-img"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop';
          }}
        />

        <div className="movie-overlay">
          <div className="overlay-content">
            <button className="book-btn" onClick={handleBooking}>
              Book
            </button>
          </div>
        </div>

        {movie.rating && (
          <div className="rating-badge">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="#fbbf24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span>{movie.rating}/10</span>
          </div>
        )}

        {movie.isNewRelease && (
          <div className="new-release-badge">
            NEW
          </div>
        )}

        {movie.format && (
          <div className="format-badge">
            {movie.format.split(',')[0].trim()}
          </div>
        )}
      </div>

      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-meta">
          {movie.genre && <span className="genre">{movie.genre.split(',')[0].trim()}</span>}
          {movie.language && <span className="language">{movie.language}</span>}
        </div>
        {movie.duration && (
          <div className="movie-duration">⏱ {movie.duration} mins</div>
        )}
        {movie.price && (
          <div className="movie-price">₹{movie.price} onwards</div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
