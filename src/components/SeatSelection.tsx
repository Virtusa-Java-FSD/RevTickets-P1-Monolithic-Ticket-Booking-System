import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/seatSelection.css';

interface Seat {
  id: string;
  row: number;
  number: string;
  status: 'available' | 'booked' | 'selected';
  deck: 'lower' | 'upper';
}

interface SeatSelectionProps {
  busName: string;
  onClose: () => void;
  onConfirm: (selectedSeats: Seat[]) => void;
}

const SeatSelection: React.FC<SeatSelectionProps> = ({ busName, onClose, onConfirm }) => {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [activeTab, setActiveTab] = useState('why-book');
  const navigate = useNavigate();

  const generateSeats = (deck: 'lower' | 'upper'): Seat[] => {
    const seats: Seat[] = [];
    const rows = deck === 'lower' ? 12 : 10;
    
    for (let row = 1; row <= rows; row++) {
      seats.push(
        {
          id: `${deck}-${row}A`,
          row,
          number: `${row}A`,
          status: Math.random() > 0.7 ? 'booked' : 'available',
          deck
        },
        {
          id: `${deck}-${row}B`,
          row,
          number: `${row}B`,
          status: Math.random() > 0.8 ? 'booked' : 'available',
          deck
        },
        {
          id: `${deck}-${row}C`,
          row,
          number: `${row}C`,
          status: Math.random() > 0.8 ? 'booked' : 'available',
          deck
        },
        {
          id: `${deck}-${row}D`,
          row,
          number: `${row}D`,
          status: Math.random() > 0.7 ? 'booked' : 'available',
          deck
        }
      );
    }
    return seats;
  };

  const lowerDeckSeats = generateSeats('lower');
  const upperDeckSeats = generateSeats('upper');

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'booked') return;
    
    const isSelected = selectedSeats.some(s => s.id === seat.id);
    
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      if (selectedSeats.length < 4) {
        setSelectedSeats([...selectedSeats, { ...seat, status: 'selected' }]);
      }
    }
  };

  const handleContinue = () => {
    localStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
    localStorage.setItem('busName', busName);
    navigate('/travel/bus/passenger-details');
  };

  const renderSeatGrid = (seats: Seat[], deckName: string) => {
    const rows = Math.max(...seats.map(s => s.row));
    
    return (
      <div className="deck-section">
        <h4 className="deck-title">{deckName}</h4>
        <div className="seat-grid">
          {Array.from({ length: rows }, (_, rowIndex) => {
            const rowNumber = rowIndex + 1;
            const rowSeats = seats.filter(s => s.row === rowNumber);
            
            return (
              <div key={rowNumber} className="seat-row">
                <div className="row-number">{rowNumber}</div>
                <div className="seat-group left">
                  {rowSeats.slice(0, 2).map(seat => (
                    <div
                      key={seat.id}
                      className={`seat ${seat.status} ${selectedSeats.some(s => s.id === seat.id) ? 'selected' : ''}`}
                      onClick={() => handleSeatClick(seat)}
                    >
                      {seat.number.slice(-1)}
                    </div>
                  ))}
                </div>
                <div className="aisle"></div>
                <div className="seat-group right">
                  {rowSeats.slice(2, 4).map(seat => (
                    <div
                      key={seat.id}
                      className={`seat ${seat.status} ${selectedSeats.some(s => s.id === seat.id) ? 'selected' : ''}`}
                      onClick={() => handleSeatClick(seat)}
                    >
                      {seat.number.slice(-1)}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="seat-selection-overlay">
      <div className="seat-selection-container">
        <div className="seat-selection-header">
          <div className="bus-info">
            <h2>{busName}</h2>
            <p>Select your seats</p>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="seat-selection-content">
          <div className="seat-layout-container">
            <div className="seat-legend">
              <div className="legend-item">
                <div className="legend-seat available"></div>
                <span>Available</span>
              </div>
              <div className="legend-item">
                <div className="legend-seat booked"></div>
                <span>Booked</span>
              </div>
              <div className="legend-item">
                <div className="legend-seat selected"></div>
                <span>Selected</span>
              </div>
            </div>
            
            <div className="bus-layout">
              {renderSeatGrid(lowerDeckSeats, 'Lower Deck')}
              {renderSeatGrid(upperDeckSeats, 'Upper Deck')}
            </div>
          </div>
          
          <div className="bus-info-section">
            <div className="selected-seats-summary">
              <h4>Selected Seats ({selectedSeats.length}/4)</h4>
              <div className="selected-list">
                {selectedSeats.map(seat => (
                  <span key={seat.id} className="selected-seat-tag">
                    {seat.number}
                  </span>
                ))}
              </div>
              <div className="total-price">
                Total: ₹{selectedSeats.length * 1200}
              </div>
            </div>
            
            <div className="info-tabs">
              {[
                { id: 'why-book', label: 'Why book this bus?' },
                { id: 'boarding', label: 'Boarding point' },
                { id: 'dropping', label: 'Dropping point' },
                { id: 'ratings', label: 'Ratings' }
              ].map(tab => (
                <button
                  key={tab.id}
                  className={`info-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div className="tab-content">
              {activeTab === 'why-book' && (
                <div>
                  <ul>
                    <li>✅ Highly rated by passengers (4.2/5)</li>
                    <li>✅ On-time performance guarantee</li>
                    <li>✅ Clean and comfortable seats</li>
                    <li>✅ Professional and courteous staff</li>
                    <li>✅ Live tracking available</li>
                  </ul>
                </div>
              )}
              {activeTab === 'boarding' && (
                <div>
                  <div className="boarding-point">
                    <p><strong>📍 Central Bus Station</strong></p>
                    <p>Departure: 6:00 PM</p>
                    <p>Platform 3, Gate A</p>
                  </div>
                  <div className="boarding-point">
                    <p><strong>📍 Airport Terminal</strong></p>
                    <p>Departure: 6:30 PM</p>
                    <p>Terminal 2, Exit Gate</p>
                  </div>
                </div>
              )}
              {activeTab === 'dropping' && (
                <div>
                  <div className="dropping-point">
                    <p><strong>📍 Main Bus Terminal</strong></p>
                    <p>Arrival: 6:00 AM</p>
                    <p>Platform 1</p>
                  </div>
                  <div className="dropping-point">
                    <p><strong>📍 Railway Station</strong></p>
                    <p>Arrival: 6:30 AM</p>
                    <p>Main Entrance</p>
                  </div>
                </div>
              )}
              {activeTab === 'ratings' && (
                <div>
                  <div className="rating-summary">
                    <div className="overall-rating">
                      <span className="rating-score">4.2</span>
                      <div className="stars">⭐⭐⭐⭐⭐</div>
                      <p>Based on 1,247 reviews</p>
                    </div>
                  </div>
                  <div className="recent-review">
                    <p><strong>Recent Review:</strong></p>
                    <p>"Excellent service and comfortable journey. Highly recommended!"</p>
                    <small>- Verified passenger</small>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="seat-selection-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="btn-continue"
            disabled={selectedSeats.length === 0}
            onClick={handleContinue}
          >
            Continue ({selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''})
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;