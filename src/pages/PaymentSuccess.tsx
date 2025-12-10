import { useNavigate, useLocation } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingType, bookingDetails } = location.state || {};

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center py-5">
      <div className="container" style={{maxWidth: '600px'}}>
        <div className="card border-0 shadow-lg text-center">
          <div className="card-body p-5">
            <div className="mb-4">
              <div className="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center" style={{width: '100px', height: '100px'}}>
                <i className="bi bi-check-circle-fill text-success" style={{fontSize: '60px'}}></i>
              </div>
            </div>
            
            <h2 className="fw-bold mb-3">Booking Confirmed!</h2>
            <p className="text-muted mb-4">
              Your {bookingType || 'bus'} booking has been confirmed successfully.
            </p>

            {bookingDetails && (
              <div className="bg-light rounded p-4 mb-4 text-start">
                <h6 className="fw-semibold mb-3">Booking Details</h6>
                <div className="small">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Total Amount:</span>
                    <span className="fw-bold text-success">₹{bookingDetails.totalAmount}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Seats:</span>
                    <span className="fw-semibold">{bookingDetails.selectedSeats?.length || 0}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Booking ID:</span>
                    <span className="fw-semibold">BUS{Math.floor(Math.random() * 1000000)}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="alert alert-info mb-4">
              <i className="bi bi-info-circle me-2"></i>
              A confirmation email has been sent to your registered email address.
            </div>

            <div className="d-grid gap-2">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/dashboard')}>
                View My Bookings
              </button>
              <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
