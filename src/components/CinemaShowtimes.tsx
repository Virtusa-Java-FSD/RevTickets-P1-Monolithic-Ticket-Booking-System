import React from 'react';
import type { Show } from '../types/Show';

interface CinemaShowtimesProps {
  shows: Show[];
  onShowSelect: (show: Show) => void;
}

const CinemaShowtimes: React.FC<CinemaShowtimesProps> = ({ shows, onShowSelect }) => {
  // Group shows by theater
  const theaterGroups = shows.reduce((acc, show) => {
    const key = show.theater;
    if (!acc[key]) {
      acc[key] = {
        theater: show.theater,
        shows: []
      };
    }
    acc[key].shows.push(show);
    return acc;
  }, {} as Record<string, { theater: string; shows: Show[] }>);

  const getAvailabilityStatus = (availableSeats: number, totalSeats: number) => {
    const percentage = (availableSeats / totalSeats) * 100;
    if (percentage > 75) return { status: 'AVAILABLE', color: '#22c55e' };
    if (percentage > 25) return { status: 'FAST FILLING', color: '#f59e0b' };
    if (percentage > 0) return { status: 'FILLING FAST', color: '#ef4444' };
    return { status: 'SOLD OUT', color: '#6b7280' };
  };

  return (
    <div className="cinema-showtimes">
      {Object.values(theaterGroups).map((theaterGroup) => (
        <div key={theaterGroup.theater} className="theater-row">
          <div className="theater-info">
            <div className="theater-name">
              <div className="cinema-logo">
                <span className="logo-text">
                  {theaterGroup.theater.split(' ').map(word => word[0]).join('').slice(0, 3)}
                </span>
              </div>
              <div className="theater-details">
                <h3>{theaterGroup.theater}</h3>
                <div className="theater-features">
                  <span className="feature-icon">🔊</span>
                  <span className="feature-icon">📱</span>
                </div>
              </div>
            </div>
            <div className="theater-status">
              <span className="non-cancellable">Non-cancellable</span>
            </div>
          </div>
          
          <div className="showtimes-container">
            {theaterGroup.shows
              .sort((a, b) => new Date(a.showDateTime).getTime() - new Date(b.showDateTime).getTime())
              .map((show) => {
                const availability = getAvailabilityStatus(show.availableSeats, show.totalSeats);
                const showTime = new Date(show.showDateTime);
                
                return (
                  <button
                    key={show.id}
                    className={`showtime-slot ${show.availableSeats === 0 ? 'sold-out' : ''}`}
                    onClick={() => onShowSelect(show)}
                    disabled={show.availableSeats === 0}
                  >
                    <div className="time-display">
                      {showTime.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </div>
                    <div className="format-info">
                      {show.format}
                    </div>
                    <div 
                      className="availability-indicator"
                      style={{ color: availability.color }}
                    >
                      {availability.status}
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CinemaShowtimes;