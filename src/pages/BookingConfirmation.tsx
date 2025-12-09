import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/travel.css";

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state;

  useEffect(() => {
    if (!bookingData) {
      navigate("/concerts");
    }
  }, [bookingData, navigate]);

  if (!bookingData) return null;

  return (
    <div className="travels-page">
      <div className="container-fluid">
        {/* Success Header */}
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          padding: '3rem 0',
          textAlign: 'center'
        }}>
          <div className="container">
            <div style={{fontSize: '4rem', marginBottom: '1rem'}}>✓</div>
            <h1 className="display-4 fw-bold mb-2">Booking Confirmed!</h1>
            <p className="lead">Your tickets have been booked successfully</p>
          </div>
        </div>

        {/* Booking Details */}
        <div className="container my-5">
          <div className="row g-4">
            {/* Left - Booking Info */}
            <div className="col-lg-8">
              <div className="booking-card">
                <h3>Booking Details</h3>
                <div className="row g-3 mt-2">
                  <div className="col-md-6">
                    <div style={{background: '#f8f9fa', padding: '1rem', borderRadius: '8px'}}>
                      <p style={{margin: '0', fontSize: '0.875rem', color: '#6c757d'}}>Concert</p>
                      <p style={{margin: '0.25rem 0 0 0', fontWeight: '600', fontSize: '1.1rem'}}>{bookingData.concertTitle}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div style={{background: '#f8f9fa', padding: '1rem', borderRadius: '8px'}}>
                      <p style={{margin: '0', fontSize: '0.875rem', color: '#6c757d'}}>Booking ID</p>
                      <p style={{margin: '0.25rem 0 0 0', fontWeight: '600', fontSize: '1.1rem'}}>BK{Date.now().toString().slice(-8)}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div style={{background: '#f8f9fa', padding: '1rem', borderRadius: '8px'}}>
                      <p style={{margin: '0', fontSize: '0.875rem', color: '#6c757d'}}>Date & Time</p>
                      <p style={{margin: '0.25rem 0 0 0', fontWeight: '600', fontSize: '1.1rem'}}>
                        {new Date(bookingData.date).toLocaleDateString()} • {bookingData.time}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div style={{background: '#f8f9fa', padding: '1rem', borderRadius: '8px'}}>
                      <p style={{margin: '0', fontSize: '0.875rem', color: '#6c757d'}}>Seats</p>
                      <p style={{margin: '0.25rem 0 0 0', fontWeight: '600', fontSize: '1.1rem'}}>{bookingData.seats}</p>
                    </div>
                  </div>
                </div>

                <h3 className="mt-4">Customer Information</h3>
                <div style={{background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginTop: '1rem'}}>
                  <div className="row">
                    <div className="col-md-4">
                      <p style={{margin: '0', fontSize: '0.875rem', color: '#6c757d'}}>Name</p>
                      <p style={{margin: '0.25rem 0 0 0', fontWeight: '600'}}>{bookingData.customerName}</p>
                    </div>
                    <div className="col-md-4">
                      <p style={{margin: '0', fontSize: '0.875rem', color: '#6c757d'}}>Email</p>
                      <p style={{margin: '0.25rem 0 0 0', fontWeight: '600'}}>{bookingData.customerEmail}</p>
                    </div>
                    <div className="col-md-4">
                      <p style={{margin: '0', fontSize: '0.875rem', color: '#6c757d'}}>Phone</p>
                      <p style={{margin: '0.25rem 0 0 0', fontWeight: '600'}}>{bookingData.customerPhone}</p>
                    </div>
                  </div>
                </div>

                <div style={{
                  background: '#d1fae5',
                  border: '1px solid #10b981',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginTop: '1.5rem'
                }}>
                  <p style={{margin: '0', fontSize: '0.9rem'}}>
                    📧 A confirmation email has been sent to <strong>{bookingData.customerEmail}</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Right - Payment Summary */}
            <div className="col-lg-4">
              <div className="booking-card sticky-summary">
                <h4>Payment Summary</h4>
                <div style={{marginTop: '1rem'}}>
                  {bookingData.seatDetails?.map((seat: any, index: number) => (
                    <div key={index} className="price-row">
                      <span>{seat.id} ({seat.category})</span>
                      <span>₹{seat.price}</span>
                    </div>
                  ))}
                  <div className="price-row">
                    <span>Convenience Fee</span>
                    <span>₹{bookingData.convenienceFee}</span>
                  </div>
                  <hr />
                  <div className="price-row total">
                    <strong>Total Paid</strong>
                    <strong>₹{bookingData.totalAmount}</strong>
                  </div>
                </div>

                <div style={{
                  background: '#f8f9fa',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginTop: '1.5rem',
                  textAlign: 'center'
                }}>
                  <p style={{margin: '0', fontSize: '0.875rem', color: '#6c757d'}}>Payment Status</p>
                  <p style={{margin: '0.5rem 0 0 0', fontWeight: '600', color: '#10b981', fontSize: '1.1rem'}}>✓ Paid</p>
                </div>

                <button
                  className="proceed-btn"
                  style={{marginTop: '1rem'}}
                  onClick={() => navigate("/dashboard")}
                >
                  View My Bookings
                </button>
                <button
                  className="proceed-btn"
                  style={{marginTop: '0.5rem', background: 'white', color: '#667eea', border: '2px solid #667eea'}}
                  onClick={() => navigate("/concerts")}
                >
                  Book More Concerts
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
