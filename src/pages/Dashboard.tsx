import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'dashboard' | 'bookings' | 'profile'>('dashboard');
  const [userInfo] = useState({
    name: user?.name || 'User',
    email: user?.email || '',
    phone: '+91 9876543210'
  });

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Import locally to avoid top-level await issues if any
  React.useEffect(() => {
    const fetchBookings = async () => {
      if (user && user.id) {
        try {
          setLoading(true);
          const { getUserBookings } = await import("../utils/api");
          const data = await getUserBookings(Number(user.id));
          setBookings(data);
        } catch (error) {
          console.error("Failed to fetch bookings", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchBookings();
  }, [user]);

  // Use real bookings if available, otherwise show empty state or mock if desired.
  // For now let's show real bookings.

  // Bookings View
  if (currentView === 'bookings') {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '20px' }}>
        <div className="container">
          <button
            onClick={() => setCurrentView('dashboard')}
            style={{
              background: 'none',
              border: 'none',
              color: '#667eea',
              fontSize: '14px',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            ← Back to Dashboard
          </button>

          <h2 style={{ fontSize: '28px', fontWeight: '600', color: '#2c3e50', marginBottom: '8px' }}>My Bookings</h2>
          <p style={{ color: '#6c757d', fontSize: '16px', marginBottom: '30px' }}>View all your booking history</p>

          <div className="row">
            <div className="col-md-12">
              <div style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#2c3e50', marginBottom: '20px' }}>Booking History</h4>

                {loading && <p>Loading bookings...</p>}

                {!loading && bookings.length === 0 && <p>No bookings found.</p>}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {bookings.map(booking => (
                    <div key={booking.id} style={{
                      padding: '15px',
                      border: '1px solid #e9ecef',
                      borderRadius: '8px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '16px', fontWeight: '600', color: '#2c3e50' }}>
                            {booking.show ? 'Movie Ticket' : booking.event ? 'Event Ticket' : booking.travel ? 'Travel Ticket' : 'Booking'}
                            • #{String(booking.id)}
                          </div>
                          <div style={{ fontSize: '14px', color: '#6c757d', marginTop: '4px' }}>
                            {new Date(booking.bookingDate).toLocaleDateString()}
                          </div>
                          {booking.show && <div style={{ fontSize: '12px', color: '#666' }}>Show ID: {booking.show.id}</div>}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '16px', fontWeight: '600', color: '#2c3e50' }}>₹{booking.totalPrice}</div>
                          <div style={{ fontSize: '12px', color: '#28a745', marginTop: '2px' }}>{booking.status}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Profile View
  if (currentView === 'profile') {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '20px' }}>
        <div className="container">
          <button
            onClick={() => setCurrentView('dashboard')}
            style={{
              background: 'none',
              border: 'none',
              color: '#667eea',
              fontSize: '14px',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            ← Back to Dashboard
          </button>

          <h2 style={{ fontSize: '28px', fontWeight: '600', color: '#2c3e50', marginBottom: '8px' }}>My Profile</h2>
          <p style={{ color: '#6c757d', fontSize: '16px', marginBottom: '30px' }}>Manage your account information</p>

          <div className="row">
            <div className="col-md-6">
              <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '32px',
                    fontWeight: '600',
                    marginRight: '20px'
                  }}>
                    {userInfo.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#2c3e50', margin: '0 0 5px 0' }}>
                      {userInfo.name}
                    </h3>
                    <p style={{ color: '#6c757d', margin: 0, fontSize: '14px' }}>Member since 2024</p>
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ fontSize: '12px', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>EMAIL</label>
                  <p style={{ fontSize: '16px', color: '#2c3e50', margin: '4px 0 0 0', fontWeight: '500' }}>{userInfo.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <button
        onClick={() => navigate("/")}
        style={{
          background: 'none',
          border: 'none',
          color: '#667eea',
          fontSize: '14px',
          cursor: 'pointer',
          marginBottom: '20px',
          padding: 0
        }}
      >
        ← Back to Home
      </button>
      <h2>Dashboard</h2>
      <p>Welcome {user?.name || user?.email || "User"}.</p>

      <div className="row">
        <div className="col-md-4">
          <div className="card mb-3" style={{ cursor: 'pointer' }} onClick={() => setCurrentView('bookings')}>
            <div className="card-body">
              <h5 className="card-title">Bookings</h5>
              <p className="card-text">
                {bookings.length > 0
                  ? `You have ${bookings.length} bookings. Click to view details.`
                  : "Your recent bookings will appear here."}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-3" style={{ cursor: 'pointer' }} onClick={() => setCurrentView('profile')}>
            <div className="card-body">
              <h5 className="card-title">Profile</h5>
              <p className="card-text">Manage your profile and payment methods.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
