import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Event } from '../types/Event';
import MovieCard from '../components/MovieCard';

const Wishlist: React.FC = () => {
  const [wishlistMovies, setWishlistMovies] = useState<Event[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load wishlist from localStorage
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      setWishlistMovies(JSON.parse(saved));
    }
  }, []);

  const handleRemoveFromWishlist = (movieId: string) => {
    const updated = wishlistMovies.filter(m => m.id !== movieId);
    setWishlistMovies(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Header */}
      <div
        style={{
          background: '#ffffff',
          padding: '2rem 0',
          color: '#222',
          borderBottom: '1px solid #e0e0e0',
          marginBottom: '2rem',
        }}
      >
        <div className="container">
          <button
            onClick={() => navigate('/movies')}
            style={{
              background: '#f0f0f0',
              border: '1px solid #ddd',
              color: '#222',
              padding: '0.5rem 1rem',
              borderRadius: '0.3rem',
              cursor: 'pointer',
              marginBottom: '1rem',
              fontSize: '0.85rem',
            }}
          >
            ← Back to Movies
          </button>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700' }}>❤️ My Wishlist</h1>
          <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
            {wishlistMovies.length} movie{wishlistMovies.length !== 1 ? 's' : ''} saved
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ marginBottom: '3rem' }}>
        {wishlistMovies.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '1.5rem',
          }}>
            {wishlistMovies.map((movie) => (
              <div key={movie.id} style={{ position: 'relative' }}>
                <MovieCard
                  movie={movie}
                  onDetailClick={(m) => alert(`Details: ${m.title}`)}
                  onBookClick={(m) => alert(`Booking: ${m.title}`)}
                />
                <button
                  onClick={() => handleRemoveFromWishlist(movie.id)}
                  style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    background: '#dc3545',
                    border: 'none',
                    color: 'white',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 5,
                  }}
                  title="Remove from wishlist"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              background: 'white',
              padding: '3rem',
              borderRadius: '0.75rem',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '3rem', margin: 0 }}>😢</p>
            <h3 style={{ margin: '1rem 0 0.5rem 0' }}>Your wishlist is empty</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>
              Browse movies and add them to your wishlist to watch later
            </p>
            <button
              onClick={() => navigate('/movies')}
              style={{
                background: '#333',
                border: 'none',
                color: 'white',
                padding: '0.8rem 2rem',
                borderRadius: '0.4rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
              }}
            >
              Explore Movies
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
