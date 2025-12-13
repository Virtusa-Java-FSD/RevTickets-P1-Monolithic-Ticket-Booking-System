import { useNavigate, useLocation } from 'react-router-dom';

const BusBookingSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { busData, selectedSeats, totalFare, boardingPoint, droppingPoint, passengers } = location.state || {};

  const baseFare = totalFare || 0;
  const taxes = Math.round(baseFare * 0.05);
  const totalAmount = baseFare + taxes;

  const handleCheckout = () => {
    navigate('/payment', {
      state: {
        total: totalAmount,
        seats: selectedSeats.map((s: any) => s.number),
        bookingType: 'TRAVEL', // or BUS
        travelId: busData?.id, // Assuming busData has an id
        busData: busData, // Pass full object just in case
        boardingPoint,
        droppingPoint,
        passengers
      }
    });
  };

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container" style={{ maxWidth: '1100px' }}>
        <div className="mb-4">
          <button className="btn btn-link text-decoration-none p-0 mb-3" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left me-2"></i>Back
          </button>
          <h2 className="fw-bold mb-2">Booking Summary</h2>
          <p className="text-muted">Review your booking details</p>
        </div>

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-2">
                <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                  <i className="bi bi-check"></i>
                </div>
                <small className="fw-medium">Seats</small>
              </div>
              <div style={{ flex: 1, height: '2px', background: '#28a745', margin: '0 8px' }}></div>
              <div className="d-flex align-items-center gap-2">
                <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                  <i className="bi bi-check"></i>
                </div>
                <small className="fw-medium">Boarding</small>
              </div>
              <div style={{ flex: 1, height: '2px', background: '#28a745', margin: '0 8px' }}></div>
              <div className="d-flex align-items-center gap-2">
                <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                  <i className="bi bi-check"></i>
                </div>
                <small className="fw-medium">Passengers</small>
              </div>
              <div style={{ flex: 1, height: '2px', background: '#667eea', margin: '0 8px' }}></div>
              <div className="d-flex align-items-center gap-2">
                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-semibold" style={{ width: '32px', height: '32px' }}>4</div>
                <small className="fw-medium">Payment</small>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title mb-3">Bus Details</h5>
                <div className="row g-3">
                  <div className="col-6">
                    <small className="text-muted d-block">Bus Name</small>
                    <span className="fw-semibold">{busData?.name || 'Travels Plus'}</span>
                  </div>
                  <div className="col-6">
                    <small className="text-muted d-block">Route</small>
                    <span className="fw-semibold">{busData?.route || 'Mumbai → Pune'}</span>
                  </div>
                  <div className="col-6">
                    <small className="text-muted d-block">Service Type</small>
                    <span className="fw-semibold">{busData?.serviceType || 'AC Sleeper'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title mb-3">Journey Details</h5>
                <div className="mb-3">
                  <small className="text-muted d-block mb-1">Boarding Point</small>
                  <p className="fw-semibold mb-1">{boardingPoint?.location}</p>
                  <small className="text-muted">{boardingPoint?.address} • {boardingPoint?.time}</small>
                </div>
                <hr />
                <div>
                  <small className="text-muted d-block mb-1">Dropping Point</small>
                  <p className="fw-semibold mb-1">{droppingPoint?.location}</p>
                  <small className="text-muted">{droppingPoint?.address} • {droppingPoint?.time}</small>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3">Passenger Details</h5>
                {passengers?.map((passenger: any, index: number) => (
                  <div key={index} className={`pb-3 mb-3 ${index < passengers.length - 1 ? 'border-bottom' : ''}`}>
                    <p className="fw-semibold mb-2">
                      Passenger {index + 1} – Seat {passenger.seatNumber}
                    </p>
                    <div className="row g-2 small">
                      <div className="col-6">
                        <span className="text-muted">Name: </span>
                        <span>{passenger.name}</span>
                      </div>
                      <div className="col-6">
                        <span className="text-muted">Age: </span>
                        <span>{passenger.age}</span>
                      </div>
                      <div className="col-6">
                        <span className="text-muted">Gender: </span>
                        <span className="text-capitalize">{passenger.gender}</span>
                      </div>
                      <div className="col-6">
                        <span className="text-muted">ID: </span>
                        <span>****{passenger.aadhaar.slice(-4)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
              <div className="card-body">
                <h5 className="card-title mb-3">Payment Summary</h5>

                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Base Fare ({selectedSeats?.length} seats)</span>
                    <span>₹{baseFare}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Taxes & Fees (5%)</span>
                    <span>₹{taxes}</span>
                  </div>
                </div>

                <hr />

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="fs-5 fw-semibold">Total Amount</span>
                  <span className="fs-4 fw-bold text-success">₹{totalAmount}</span>
                </div>

                <div className="d-grid mb-4">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </button>
                </div>

                <div className="d-flex flex-column gap-2">
                  <div className="d-flex align-items-center gap-2 small text-muted">
                    <i className="bi bi-shield-check text-success"></i>
                    <span>Secure payment</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 small text-muted">
                    <i className="bi bi-check-circle text-success"></i>
                    <span>Instant confirmation</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 small text-muted">
                    <i className="bi bi-headset text-success"></i>
                    <span>24/7 support</span>
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

export default BusBookingSummary;
