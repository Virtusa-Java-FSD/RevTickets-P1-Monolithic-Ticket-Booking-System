import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Passenger {
  seatNumber: string;
  name: string;
  age: string;
  gender: string;
  aadhaar: string;
}

const BusPassengerInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { busData, selectedSeats, totalFare, boardingPoint, droppingPoint } = location.state || {};
  
  const [passengers, setPassengers] = useState<Passenger[]>(
    selectedSeats?.map((seat: any) => ({
      seatNumber: seat.number,
      name: '',
      age: '',
      gender: '',
      aadhaar: ''
    })) || []
  );

  const handleInputChange = (index: number, field: keyof Passenger, value: string) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const validateAndContinue = () => {
    for (const passenger of passengers) {
      if (!passenger.name || !passenger.age || !passenger.gender || !passenger.aadhaar) {
        alert('Please fill all passenger details');
        return;
      }
      if (passenger.aadhaar.length !== 12) {
        alert('Aadhaar number must be 12 digits');
        return;
      }
    }
    
    navigate('/bus-booking-summary', {
      state: {
        busData,
        selectedSeats,
        totalFare,
        boardingPoint,
        droppingPoint,
        passengers
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
          <h2 className="fw-bold mb-2">Passenger Details</h2>
          <p className="text-muted">Enter details for all passengers</p>
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
              <div style={{flex: 1, height: '2px', background: '#28a745', margin: '0 8px'}}></div>
              <div className="d-flex align-items-center gap-2">
                <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px'}}>
                  <i className="bi bi-check"></i>
                </div>
                <small className="fw-medium">Boarding</small>
              </div>
              <div style={{flex: 1, height: '2px', background: '#667eea', margin: '0 8px'}}></div>
              <div className="d-flex align-items-center gap-2">
                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-semibold" style={{width: '32px', height: '32px'}}>3</div>
                <small className="fw-medium">Passengers</small>
              </div>
              <div style={{flex: 1, height: '2px', background: '#dee2e6', margin: '0 8px'}}></div>
              <div className="d-flex align-items-center gap-2">
                <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center fw-semibold" style={{width: '32px', height: '32px'}}>4</div>
                <small className="text-muted fw-medium">Payment</small>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          {passengers.map((passenger, index) => (
            <div key={index} className="card border-0 shadow-sm mb-3">
              <div className="card-body">
                <h5 className="card-title mb-3">
                  Passenger {index + 1} – Seat {passenger.seatNumber}
                </h5>
                
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-medium">
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={passenger.name}
                      onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                      placeholder="Enter full name"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-medium">
                      Age <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={passenger.age}
                      onChange={(e) => handleInputChange(index, 'age', e.target.value)}
                      placeholder="Enter age"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-medium">
                      Gender <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={passenger.gender}
                      onChange={(e) => handleInputChange(index, 'gender', e.target.value)}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-medium">
                      Aadhaar/ID Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={passenger.aadhaar}
                      onChange={(e) => handleInputChange(index, 'aadhaar', e.target.value.replace(/\D/g, '').slice(0, 12))}
                      placeholder="Enter 12-digit Aadhaar"
                      maxLength={12}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">Total Fare for {passengers.length} passenger(s)</small>
                <h3 className="fw-bold mb-0">₹{totalFare || 0}</h3>
              </div>
              <button
                className="btn btn-primary btn-lg px-4"
                onClick={validateAndContinue}
              >
                Continue to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusPassengerInfo;
