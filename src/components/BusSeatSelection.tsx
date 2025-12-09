import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Seat {
  id: string;
  row: number;
  col: number;
  type: 'seater' | 'sleeper';
  price: number;
  status: 'available' | 'for-female' | 'for-male' | 'female-booked' | 'booked';
  deck: 'lower' | 'upper';
}

const BusSeatSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state || {};
  
  const [activeDeck, setActiveDeck] = useState<'lower' | 'upper'>('lower');
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  useEffect(() => {
    loadSeats();
  }, []);

  const loadSeats = () => {
    const mockSeats: Seat[] = [];
    
    // Lower deck - 6 rows x 3 columns
    for (let row = 1; row <= 6; row++) {
      for (let col = 1; col <= 3; col++) {
        const seatNum = `L${row}${col}`;
        const random = Math.random();
        mockSeats.push({
          id: seatNum,
          row,
          col,
          type: row > 3 ? 'sleeper' : 'seater',
          price: 900,
          status: random > 0.8 ? 'booked' : random > 0.7 ? 'female-booked' : random > 0.6 ? 'for-female' : random > 0.5 ? 'for-male' : 'available',
          deck: 'lower'
        });
      }
    }
    
    // Upper deck - 6 rows x 3 columns
    for (let row = 1; row <= 6; row++) {
      for (let col = 1; col <= 3; col++) {
        const seatNum = `U${row}${col}`;
        const random = Math.random();
        mockSeats.push({
          id: seatNum,
          row,
          col,
          type: row > 3 ? 'sleeper' : 'seater',
          price: 900,
          status: random > 0.8 ? 'booked' : random > 0.7 ? 'female-booked' : random > 0.6 ? 'for-female' : random > 0.5 ? 'for-male' : 'available',
          deck: 'upper'
        });
      }
    }
    
    setSeats(mockSeats);
  };

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'booked' || seat.status === 'female-booked') return;

    const isSelected = selectedSeats.find(s => s.id === seat.id);
    
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    navigate('/booking-details', {
      state: {
        ...bookingData,
        selectedSeats: selectedSeats,
        totalPrice: selectedSeats.reduce((sum, seat) => sum + seat.price, 0)
      }
    });
  };

  const getSeatStyle = (seat: Seat) => {
    const isSelected = selectedSeats.find(s => s.id === seat.id);
    
    const baseStyle = {
      width: seat.type === 'sleeper' ? '80px' : '70px',
      height: seat.type === 'sleeper' ? '100px' : '70px',
      border: '2px solid',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      cursor: (seat.status === 'booked' || seat.status === 'female-booked') ? 'not-allowed' : 'pointer',
      fontSize: '13px',
      fontWeight: '500',
      transition: 'all 0.2s ease'
    };

    if (isSelected) {
      return {
        ...baseStyle,
        background: '#4CAF50',
        borderColor: '#4CAF50',
        color: 'white'
      };
    }

    switch (seat.status) {
      case 'available':
        return {
          ...baseStyle,
          background: 'white',
          borderColor: '#e0e0e0',
          color: '#333'
        };
      case 'for-female':
        return {
          ...baseStyle,
          background: '#FFE5F0',
          borderColor: '#FF69B4',
          color: '#C71585'
        };
      case 'for-male':
        return {
          ...baseStyle,
          background: '#E3F2FD',
          borderColor: '#2196F3',
          color: '#1976D2'
        };
      case 'female-booked':
        return {
          ...baseStyle,
          background: '#FFB6C1',
          borderColor: '#FF1493',
          color: '#8B0000',
          opacity: 0.6
        };
      case 'booked':
        return {
          ...baseStyle,
          background: '#BDBDBD',
          borderColor: '#9E9E9E',
          color: '#666',
          opacity: 0.6
        };
      default:
        return baseStyle;
    }
  };

  const filteredSeats = seats.filter(s => s.deck === activeDeck);
  const rows = Array.from(new Set(filteredSeats.map(s => s.row))).sort();

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '0' }}>
      {/* Header */}
      <div style={{ background: 'white', padding: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => navigate(-1)}
            style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
          >
            ←
          </button>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 4px 0' }}>
              {bookingData.route || 'Hyderabad → Pune'}
            </h2>
            <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
              {bookingData.departure || 'Wed 10 Dec 2025, 21:30'} | {bookingData.name || 'Citizen Bus'}
            </p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ background: 'white', padding: '12px 16px', borderBottom: '1px solid #e0e0e0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '16px', height: '16px', background: 'white', border: '2px solid #e0e0e0', borderRadius: '3px' }} />
            <span>Available</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '16px', height: '16px', background: '#FFE5F0', border: '2px solid #FF69B4', borderRadius: '3px' }} />
            <span>For Female</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '16px', height: '16px', background: '#E3F2FD', border: '2px solid #2196F3', borderRadius: '3px' }} />
            <span>For Male</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '16px', height: '16px', background: '#FFB6C1', border: '2px solid #FF1493', borderRadius: '3px' }} />
            <span>Female booked</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '16px', height: '16px', background: '#BDBDBD', border: '2px solid #9E9E9E', borderRadius: '3px' }} />
            <span>Booked</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* Lower Deck */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ fontSize: '32px' }}>🚗</div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Lower</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {rows.map(row => (
                <div key={row} style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  {filteredSeats
                    .filter(s => s.row === row && s.deck === 'lower')
                    .map(seat => (
                      <div
                        key={seat.id}
                        onClick={() => handleSeatClick(seat)}
                        style={getSeatStyle(seat)}
                      >
                        <div>₹{seat.price}</div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>

          {/* Upper Deck */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Upper</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {rows.map(row => (
                <div key={row} style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  {filteredSeats
                    .filter(s => s.row === row && s.deck === 'upper')
                    .map(seat => (
                      <div
                        key={seat.id}
                        onClick={() => handleSeatClick(seat)}
                        style={getSeatStyle(seat)}
                      >
                        <div>₹{seat.price}</div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        {selectedSeats.length > 0 && (
          <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'white',
            padding: '16px',
            boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                {selectedSeats.length} Seat(s) Selected
              </div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#333' }}>
                ₹{selectedSeats.reduce((sum, seat) => sum + seat.price, 0)}
              </div>
            </div>
            <button
              onClick={handleContinue}
              style={{
                padding: '12px 32px',
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusSeatSelection;
