import { useLocation, useNavigate } from 'react-router-dom';

const BookingSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingData, passengers } = location.state || {};

  const maskAadhaar = (aadhaar: string) => {
    if (!aadhaar || aadhaar.length !== 12) return aadhaar;
    return `**** **** ${aadhaar.slice(-4)}`;
  };

  const maskPassport = (passport: string) => {
    if (!passport || passport.length < 6) return passport;
    return `${passport.slice(0, 2)}****${passport.slice(-2)}`;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
            Booking Confirmed!
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Your booking has been successfully completed
          </p>
        </div>

        {/* Trip Details */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
            Trip Details
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280' }}>Service</span>
              <span style={{ fontWeight: '600', color: '#1f2937' }}>{bookingData?.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280' }}>Route</span>
              <span style={{ fontWeight: '600', color: '#1f2937' }}>{bookingData?.route}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280' }}>Date & Time</span>
              <span style={{ fontWeight: '600', color: '#1f2937' }}>{bookingData?.departure}</span>
            </div>
            {bookingData?.trainClass && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Class</span>
                <span style={{ fontWeight: '600', color: '#1f2937' }}>{bookingData.trainClass.name}</span>
              </div>
            )}
            {bookingData?.selectedSeats && bookingData.selectedSeats.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Seats</span>
                <span style={{ fontWeight: '600', color: '#1f2937' }}>
                  {bookingData.selectedSeats.map((s: any) => s.id).join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Passenger Details */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
            Passenger Details
          </h3>
          {passengers?.map((passenger: any, index: number) => (
            <div key={index} style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', marginBottom: '12px' }}>
              <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
                Passenger {index + 1}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Name</span>
                  <span style={{ color: '#1f2937' }}>
                    {passenger.title} {passenger.firstName} {passenger.lastName}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Gender</span>
                  <span style={{ color: '#1f2937' }}>{passenger.gender}</span>
                </div>
                {passenger.age && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Age</span>
                    <span style={{ color: '#1f2937' }}>{passenger.age}</span>
                  </div>
                )}
                {passenger.aadhaar && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Aadhaar</span>
                    <span style={{ color: '#1f2937' }}>{maskAadhaar(passenger.aadhaar)}</span>
                  </div>
                )}
                {passenger.passport && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Passport</span>
                    <span style={{ color: '#1f2937' }}>{maskPassport(passenger.passport)}</span>
                  </div>
                )}
                {bookingData?.selectedSeats?.[index] && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Seat</span>
                    <span style={{ color: '#1f2937' }}>{bookingData.selectedSeats[index].id}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Total Price */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
            <span>Total Paid</span>
            <span>₹{bookingData?.totalPrice || bookingData?.price || 0}</span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate('/travels')}
            style={{
              flex: 1,
              padding: '14px',
              background: 'white',
              color: '#3b82f6',
              border: '1px solid #3b82f6',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Book Another
          </button>
          <button
            onClick={() => window.print()}
            style={{
              flex: 1,
              padding: '14px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Download Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
