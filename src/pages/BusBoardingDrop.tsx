import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface BoardingPoint {
  id: string;
  location: string;
  time: string;
  address: string;
}

interface DroppingPoint {
  id: string;
  location: string;
  time: string;
  address: string;
}

const BusBoardingDrop = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { busData, selectedSeats, totalFare } = location.state || {};
  
  const [selectedBoarding, setSelectedBoarding] = useState<string>('');
  const [selectedDropping, setSelectedDropping] = useState<string>('');

  const boardingPoints: BoardingPoint[] = [
    { id: 'b1', location: 'Kukatpally', time: '22:00', address: 'Near KPHB Metro Station' },
    { id: 'b2', location: 'Ameerpet', time: '22:30', address: 'Ameerpet Metro Station' },
    { id: 'b3', location: 'Secunderabad', time: '23:00', address: 'Secunderabad Railway Station' },
    { id: 'b4', location: 'LB Nagar', time: '23:30', address: 'LB Nagar Bus Stop' }
  ];

  const droppingPoints: DroppingPoint[] = [
    { id: 'd1', location: 'Pune Station', time: '06:00', address: 'Pune Railway Station' },
    { id: 'd2', location: 'Hinjewadi', time: '06:30', address: 'Hinjewadi IT Park' },
    { id: 'd3', location: 'Wakad', time: '07:00', address: 'Wakad Chowk' },
    { id: 'd4', location: 'Pimpri', time: '07:30', address: 'Pimpri Bus Stand' }
  ];

  const handleContinue = () => {
    if (!selectedBoarding || !selectedDropping) return;
    
    const boarding = boardingPoints.find(b => b.id === selectedBoarding);
    const dropping = droppingPoints.find(d => d.id === selectedDropping);
    
    navigate('/bus-passenger-info', {
      state: {
        busData,
        selectedSeats,
        totalFare,
        boardingPoint: boarding,
        droppingPoint: dropping
      }
    });
  };

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container" style={{maxWidth: '900px'}}>
        <div className="mb-4">
          <button className="btn btn-link text-decoration-none p-0 mb-3" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left me-2"></i>Back
          </button>
          <h2 className="fw-bold mb-2">Boarding & Dropping Points</h2>
          <p className="text-muted">Select your pickup and drop locations</p>
        </div>

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-2">
                <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px'}}>
                  <i className="bi bi-check"></i>
                </div>
                <small className="fw-medium">Seats</small>
              </div>
              <div style={{flex: 1, height: '2px', background: '#667eea', margin: '0 8px'}}></div>
              <div className="d-flex align-items-center gap-2">
                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-semibold" style={{width: '32px', height: '32px'}}>2</div>
                <small className="fw-medium">Boarding</small>
              </div>
              <div style={{flex: 1, height: '2px', background: '#dee2e6', margin: '0 8px'}}></div>
              <div className="d-flex align-items-center gap-2">
                <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center fw-semibold" style={{width: '32px', height: '32px'}}>3</div>
                <small className="text-muted fw-medium">Passengers</small>
              </div>
              <div style={{flex: 1, height: '2px', background: '#dee2e6', margin: '0 8px'}}></div>
              <div className="d-flex align-items-center gap-2">
                <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center fw-semibold" style={{width: '32px', height: '32px'}}>4</div>
                <small className="text-muted fw-medium">Payment</small>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title mb-3">Boarding Points</h5>
                <div className="d-flex flex-column gap-2">
                  {boardingPoints.map(point => (
                    <button
                      key={point.id}
                      onClick={() => setSelectedBoarding(point.id)}
                      className={`btn text-start p-3 border-2 ${
                        selectedBoarding === point.id
                          ? 'border-primary bg-primary bg-opacity-10'
                          : 'border-secondary bg-white'
                      }`}
                      style={{borderRadius: '8px'}}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <span className="fw-semibold">{point.location}</span>
                        <span className="badge bg-primary">{point.time}</span>
                      </div>
                      <small className="text-muted">{point.address}</small>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title mb-3">Dropping Points</h5>
                <div className="d-flex flex-column gap-2">
                  {droppingPoints.map(point => (
                    <button
                      key={point.id}
                      onClick={() => setSelectedDropping(point.id)}
                      className={`btn text-start p-3 border-2 ${
                        selectedDropping === point.id
                          ? 'border-primary bg-primary bg-opacity-10'
                          : 'border-secondary bg-white'
                      }`}
                      style={{borderRadius: '8px'}}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <span className="fw-semibold">{point.location}</span>
                        <span className="badge bg-primary">{point.time}</span>
                      </div>
                      <small className="text-muted">{point.address}</small>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">Selected Seats: {selectedSeats?.length || 0}</small>
                <h3 className="fw-bold mb-0">₹{totalFare || 0}</h3>
              </div>
              <button
                className="btn btn-primary btn-lg px-4"
                onClick={handleContinue}
                disabled={!selectedBoarding || !selectedDropping}
              >
                Continue to Passenger Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusBoardingDrop;
