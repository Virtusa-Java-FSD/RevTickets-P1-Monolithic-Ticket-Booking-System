import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/busSeatSelection.css';

interface Seat {
  id: string;
  row: number;
  col: string;
  number: string;
  price: number;
  status: 'available' | 'booked' | 'selected';
  deck: 'lower' | 'upper';
}

const BusSeatSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const busData = location.state || {};
  
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  useEffect(() => {
    generateSeats();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const generateSeats = () => {
    const allSeats: Seat[] = [];
    const columns = ['A', 'B', 'C', 'D'];
    
    for (let row = 1; row <= 9; row++) {
      columns.forEach(col => {
        const random = Math.random();
        allSeats.push({
          id: `L${row}${col}`,
          row,
          col,
          number: `${row}${col}`,
          price: 1200,
          status: random > 0.7 ? 'booked' : 'available',
          deck: 'lower'
        });
      });
    }
    
    for (let row = 1; row <= 9; row++) {
      columns.forEach(col => {
        const random = Math.random();
        allSeats.push({
          id: `U${row}${col}`,
          row,
          col,
          number: `${row}${col}`,
          price: 1200,
          status: random > 0.7 ? 'booked' : 'available',
          deck: 'upper'
        });
      });
    }
    
    setSeats(allSeats);
  };

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'booked') return;
    
    const isSelected = selectedSeats.find(s => s.id === seat.id);
    
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
      setSeats(seats.map(s => s.id === seat.id ? { ...s, status: 'available' } : s));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
      setSeats(seats.map(s => s.id === seat.id ? { ...s, status: 'selected' } : s));
    }
  };

  const closeModal = () => {
    navigate(-1);
  };

  const handleOverlayClick = () => {
    closeModal();
  };

  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) return;
    navigate('/bus-boarding-drop', { 
      state: { 
        busData, 
        selectedSeats,
        totalFare: selectedSeats.reduce((sum, s) => sum + s.price, 0)
      } 
    });
  };

  const renderDeck = (deckType: 'lower' | 'upper') => {
    const deckSeats = seats.filter(s => s.deck === deckType);
    const rows = Array.from(new Set(deckSeats.map(s => s.row))).sort((a, b) => a - b);
    
    return (
      <div className="card border-0 shadow-sm h-100">
        <div className="card-body">
          <h5 className="card-title mb-4 text-capitalize">{deckType} Deck</h5>
          <div className="d-flex flex-column align-items-center gap-3">
            <span className="badge bg-primary rounded-pill px-3 py-2">FRONT</span>
            {rows.map(row => (
              <div key={row} className="d-flex align-items-center gap-2">
                <span className="seat-row-number">{row}</span>
                <div className="d-flex gap-2">
                  {['A', 'B'].map(col => {
                    const seat = deckSeats.find(s => s.row === row && s.col === col);
                    return seat ? (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat)}
                        disabled={seat.status === 'booked'}
                        className={`seat-btn ${seat.status}`}
                      >
                        {seat.col}
                      </button>
                    ) : <div key={col} style={{width: '48px'}} />;
                  })}
                </div>
                <div className="seat-aisle" />
                <div className="d-flex gap-2">
                  {['C', 'D'].map(col => {
                    const seat = deckSeats.find(s => s.row === row && s.col === col);
                    return seat ? (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat)}
                        disabled={seat.status === 'booked'}
                        className={`seat-btn ${seat.status}`}
                      >
                        {seat.col}
                      </button>
                    ) : <div key={col} style={{width: '48px'}} />;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bus-seat-modal-overlay" onClick={handleOverlayClick}>
      <div className="bus-seat-modal-container modal-xl" onClick={handleModalContentClick}>
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header bg-gradient text-white border-0">
            <div>
              <h4 className="modal-title mb-1">{busData.name || 'Travels Plus'}</h4>
              <p className="mb-0 small opacity-75">Select your seats</p>
            </div>
            <button 
              type="button" 
              className="modal-close-btn"
              onClick={closeModal}
              aria-label="Close"
            >
              ×
            </button>
          </div>
          
          <div className="modal-body bg-light p-4">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body py-3">
                <div className="d-flex justify-content-center gap-4 flex-wrap">
                  <div className="d-flex align-items-center gap-2">
                    <div className="seat-legend available"></div>
                    <small className="fw-medium">Available</small>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <div className="seat-legend booked"></div>
                    <small className="fw-medium">Booked</small>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <div className="seat-legend selected"></div>
                    <small className="fw-medium">Selected</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-lg-4">{renderDeck('lower')}</div>
              <div className="col-lg-4">{renderDeck('upper')}</div>
              
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm sticky-top" style={{top: '20px'}}>
                  <div className="card-body">
                    <h5 className="card-title mb-3">Selected Seats ({selectedSeats.length}/4)</h5>
                    
                    {selectedSeats.length === 0 ? (
                      <p className="text-muted text-center py-5 small">No seats selected</p>
                    ) : (
                      <div className="mb-4">
                        {selectedSeats.map(seat => (
                          <div key={seat.id} className="d-flex justify-content-between align-items-center p-2 bg-light rounded mb-2">
                            <span className="fw-medium">Seat {seat.number}</span>
                            <span className="text-success fw-bold">₹{seat.price}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="border-top pt-3 mb-4">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fs-5 fw-semibold">Total:</span>
                        <span className="fs-4 fw-bold text-success">
                          ₹{selectedSeats.reduce((sum, s) => sum + s.price, 0)}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="d-flex align-items-start gap-2 mb-2">
                        <i className="bi bi-check-circle-fill text-success"></i>
                        <small className="text-muted">Highly rated by passengers (4.2/5)</small>
                      </div>
                      <div className="d-flex align-items-start gap-2 mb-2">
                        <i className="bi bi-check-circle-fill text-success"></i>
                        <small className="text-muted">On-time performance guarantee</small>
                      </div>
                      <div className="d-flex align-items-start gap-2">
                        <i className="bi bi-check-circle-fill text-success"></i>
                        <small className="text-muted">Clean and comfortable seats</small>
                      </div>
                    </div>

                    <div className="d-grid gap-2">
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                      <button 
                        className="btn btn-primary btn-lg"
                        onClick={handleContinue}
                        disabled={selectedSeats.length === 0}
                      >
                        Continue ({selectedSeats.length} seats)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusSeatSelection;
