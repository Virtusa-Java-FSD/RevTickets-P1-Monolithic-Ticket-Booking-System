import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'dashboard' | 'bookings' | 'profile'>('dashboard');
  const [userInfo, setUserInfo] = useState({
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

  const renderContent = () => {
    if (currentView === 'profile') {
      return (
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: '600', color: '#2c3e50', marginBottom: '8px' }}>My Profile</h2>
          <p style={{ color: '#6c757d', fontSize: '16px', marginBottom: '30px' }}>Manage your account information</p>
          
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
      );
    }
    
    if (currentView === 'bookings') {
      return (
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: '600', color: '#2c3e50', marginBottom: '8px' }}>My Bookings</h2>
          <p style={{ color: '#6c757d', fontSize: '16px', marginBottom: '30px' }}>View all your booking history</p>
          
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
      );
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex' }}>
      {/* Sidebar */}
      <div style={{
        width: '280px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
      }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            fontSize: '14px',
            cursor: 'pointer',
            marginBottom: '30px',
            padding: '8px 16px',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            width: '100%'
          }}
        >
          ← Back to Home
        </button>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: 'white', fontSize: '24px', fontWeight: '700', marginBottom: '5px' }}>Dashboard</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>Welcome, {user?.name || "User"}!</p>
        </div>

        <nav>
          <div 
            style={{
              padding: '15px 20px',
              marginBottom: '10px',
              borderRadius: '12px',
              cursor: 'pointer',
              background: currentView === 'profile' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: 'white',
              fontSize: '16px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
            onClick={() => setCurrentView('profile')}
          >
            <span style={{ fontSize: '20px' }}>👤</span>
            My Profile
          </div>
          
          <div 
            style={{
              padding: '15px 20px',
              marginBottom: '10px',
              borderRadius: '12px',
              cursor: 'pointer',
              background: currentView === 'bookings' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: 'white',
              fontSize: '16px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
            onClick={() => setCurrentView('bookings')}
          >
            <span style={{ fontSize: '20px' }}>📋</span>
            My Bookings
            {bookings.length > 0 && (
              <span style={{
                background: 'rgba(255,255,255,0.3)',
                borderRadius: '12px',
                padding: '2px 8px',
                fontSize: '12px',
                marginLeft: 'auto'
              }}>
                {bookings.length}
              </span>
            )}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '40px' }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
