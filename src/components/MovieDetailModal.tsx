import React, { useState } from 'react';
import type { Event } from '../types/Event';

interface MovieDetailModalProps {
  movie: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
  movie,
  isOpen,
  onClose,
}) => {
  const [userRating, setUserRating] = useState<number | null>(null);
  const [userReview, setUserReview] = useState('');
  const [reviews, setReviews] = useState<{ rating: number; text: string; author: string }[]>([
    { rating: 5, text: 'Amazing movie! Highly recommended.', author: 'John D.' },
    { rating: 4, text: 'Great cinematography and storyline.', author: 'Sarah M.' },
    { rating: 5, text: 'Best movie of the year!', author: 'Mike R.' },
  ]);

  if (!isOpen || !movie) return null;

  const handleSubmitReview = () => {
    if (userRating && userReview.trim()) {
      setReviews([
        ...reviews,
        { rating: userRating, text: userReview, author: 'You' },
      ]);
      setUserRating(null);
      setUserReview('');
    }
  };

  const avgReviewRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  const mockCast = ['Leonardo DiCaprio', 'Marion Cotillard', 'Tom Hardy', 'Ellen Page'];
  const mockDirector = 'Christopher Nolan';
  const mockSynopsis =
    'A skilled thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O. Visually stunning and philosophically engaging, this masterpiece explores the nature of reality and dreams.';

  return (
    <div
      className={`modal fade ${isOpen ? 'show' : ''}`}
      style={{ display: isOpen ? 'block' : 'none' }}
      role="dialog"
    >
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content">
          {/* Modal Header */}
          <div className="modal-header" style={{ borderBottom: '1px solid #ddd', padding: '0.75rem' }}>
            <div className="d-flex align-items-center gap-2">
              <div
                style={{
                  width: '50px',
                  height: '65px',
                  borderRadius: '4px',
                  background: `linear-gradient(135deg, ${getGradientColor(movie.title)})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: 'bold',
                }}
              >
                {movie.title.charAt(0)}
              </div>
              <div>
                <h5 className="modal-title mb-0" style={{ fontSize: '1rem', color: '#222' }}>{movie.title}</h5>
                <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                  {movie.releaseDate} • {movie.duration} mins
                </p>
              </div>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body" style={{ padding: '0.75rem' }}>
            {/* Rating and Details */}
            <div className="row mb-3">
              <div className="col-md-6">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#333' }}>
                    {movie.rating}
                  </span>
                  <span className="text-warning" style={{ fontSize: '0.85rem' }}>
                    {'★'.repeat(Math.round(movie.rating || 0) / 2)}
                    {'☆'.repeat(5 - Math.round(movie.rating || 0) / 2)}
                  </span>
                  <span className="text-muted" style={{ fontSize: '0.8rem' }}>({movie.reviewCount} reviews)</span>
                </div>
                <div className="mb-2">
                  <h6 className="fw-bold mb-0" style={{ fontSize: '0.8rem' }}>Genre</h6>
                  <p style={{ fontSize: '0.8rem', margin: '0.2rem 0' }}>{movie.genre}</p>
                </div>
                <div className="mb-2">
                  <h6 className="fw-bold mb-0" style={{ fontSize: '0.8rem' }}>Language</h6>
                  <p style={{ fontSize: '0.8rem', margin: '0.2rem 0' }}>{movie.language}</p>
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-2">
                  <h6 className="fw-bold mb-0" style={{ fontSize: '0.8rem' }}>Director</h6>
                  <p style={{ fontSize: '0.8rem', margin: '0.2rem 0' }}>{mockDirector}</p>
                </div>
                <div className="mb-2">
                  <h6 className="fw-bold mb-0" style={{ fontSize: '0.8rem' }}>Cast</h6>
                  <p style={{ fontSize: '0.75rem', margin: '0.2rem 0' }}>{mockCast.join(', ')}</p>
                </div>
                <div>
                  <h6 className="fw-bold mb-0" style={{ fontSize: '0.8rem' }}>Seats Available</h6>
                  <p style={{ margin: '0.2rem 0' }}>
                    <span className="badge bg-success" style={{ fontSize: '0.7rem' }}>{movie.seatsAvailable || 150} seats</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Synopsis */}
            <div className="mb-3">
              <h6 className="fw-bold mb-1" style={{ fontSize: '0.8rem' }}>Synopsis</h6>
              <p style={{ lineHeight: '1.4', color: '#555', fontSize: '0.8rem' }}>{mockSynopsis}</p>
            </div>

            {/* Showtimes */}
            <div className="mb-3">
              <h6 className="fw-bold mb-1" style={{ fontSize: '0.8rem' }}>Available Showtimes</h6>
              <div className="d-flex flex-wrap gap-1">
                {movie.showtimes?.map((time, idx) => (
                  <button
                    key={idx}
                    className="btn btn-outline-primary btn-sm"
                    style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem' }}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* User Rating */}
            <div className="mb-2" style={{ borderTop: '1px solid #eee', paddingTop: '0.75rem' }}>
              <h6 className="fw-bold mb-2" style={{ fontSize: '0.8rem' }}>Rate & Review</h6>
              <div className="mb-2">
                <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.3rem' }}>Your Rating</label>
                <div className="d-flex gap-1" style={{ fontSize: '1rem' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setUserRating(star)}
                      style={{
                        cursor: 'pointer',
                        color: userRating && userRating >= star ? '#ffc107' : '#ddd',
                        transition: 'color 0.2s',
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <div className="mb-2">
                <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.3rem' }}>Your Review</label>
                <textarea
                  className="form-control form-control-sm"
                  rows={2}
                  placeholder="Share your thoughts..."
                  style={{ fontSize: '0.8rem' }}
                  value={userReview}
                  onChange={(e) => setUserReview(e.target.value)}
                />
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleSubmitReview}
                disabled={!userRating || !userReview.trim()}
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
              >
                Submit
              </button>
            </div>

            {/* Reviews */}
            <div style={{ borderTop: '1px solid #eee', paddingTop: '0.75rem' }}>
              <h6 className="fw-bold mb-2" style={{ fontSize: '0.8rem' }}>
                Reviews (Avg: {avgReviewRating}/5 - {reviews.length})
              </h6>
              <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                {reviews.map((review, idx) => (
                  <div key={idx} className="mb-2" style={{ borderLeft: '2px solid #667eea', paddingLeft: '0.6rem' }}>
                    <div className="d-flex justify-content-between align-items-start mb-0">
                      <strong style={{ fontSize: '0.8rem' }}>{review.author}</strong>
                      <span className="text-warning" style={{ fontSize: '0.7rem' }}>
                        {'★'.repeat(review.rating)}
                        {'☆'.repeat(5 - review.rating)}
                      </span>
                    </div>
                    <p className="mb-0" style={{ color: '#555', fontSize: '0.75rem', lineHeight: '1.3' }}>
                      {review.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer" style={{ borderTop: '1px solid #ddd', padding: '0.6rem' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose} style={{ fontSize: '0.8rem' }}>
              Close
            </button>
            <button type="button" className="btn btn-primary btn-sm" style={{ fontSize: '0.8rem' }}>
              Book Tickets
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="modal-backdrop fade show" onClick={onClose}></div>
      )}
    </div>
  );
};

function getGradientColor(title: string): string {
  const colors = [
    '#667eea, #764ba2',
    '#f093fb, #f5576c',
    '#4facfe, #00f2fe',
    '#43e97b, #38f9d7',
    '#fa709a, #fee140',
    '#30cfd0, #330867',
  ];
  return colors[title.charCodeAt(0) % colors.length];
}
