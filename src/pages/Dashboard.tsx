import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: user?.name || 'Sai Deep Goud',
    email: user?.email || 'burrasaideep24@gmail.com',
    phone: '+91 9876543210'
  });

  const mockBookingHistory = [
    { id: 1, type: 'Flight', route: 'DEL → BOM', date: '2024-01-15', amount: 5500, status: 'Completed' },
    { id: 2, type: 'Train', route: 'NDLS → MMCT', date: '2024-01-10', amount: 2800, status: 'Completed' },
    { id: 3, type: 'Bus', route: 'Mumbai → Pune', date: '2024-01-05', amount: 800, status: 'Completed' }
  ];

  const mockUpcomingTrips = [
    { id: 4, type: 'Flight', route: 'BLR → MAA', date: '2024-02-20', amount: 4200, status: 'Confirmed' }
  ];

  if (showProfile) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '20px' }}>
        <div className="container">
          <button 
            onClick={() => setShowProfile(false)}
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
          <p style={{ color: '#6c757d', fontSize: '16px', marginBottom: '30px' }}>Manage your account information and view your booking history</p>

          <div className="row">
            <div className="col-md-6">
              <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
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
                    <p style={{ color: '#6c757d', margin: 0, fontSize: '14px' }}>Member since January 2024</p>
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ fontSize: '12px', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>EMAIL</label>
                  <p style={{ fontSize: '16px', color: '#2c3e50', margin: '4px 0 0 0', fontWeight: '500' }}>{userInfo.email}</p>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '12px', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>PHONE NUMBER</label>
                  <p style={{ fontSize: '16px', color: '#2c3e50', margin: '4px 0 0 0', fontWeight: '500' }}>{userInfo.phone}</p>
                </div>
                <button style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  Edit Profile
                </button>
              </div>

              <div style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#2c3e50', marginBottom: '20px' }}>Upcoming Trips</h4>
                {mockUpcomingTrips.map(trip => (
                  <div key={trip.id} style={{ 
                    padding: '15px', 
                    border: '1px solid #e9ecef', 
                    borderRadius: '8px',
                    marginBottom: '10px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#2c3e50' }}>
                          {trip.type} • {trip.route}
                        </div>
                        <div style={{ fontSize: '14px', color: '#6c757d', marginTop: '4px' }}>{trip.date}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#28a745' }}>₹{trip.amount}</div>
                        <div style={{ fontSize: '12px', color: '#28a745', marginTop: '2px' }}>{trip.status}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-md-6">
              <div style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#2c3e50', marginBottom: '20px' }}>Booking History</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {mockBookingHistory.map(booking => (
                    <div key={booking.id} style={{ 
                      padding: '15px', 
                      border: '1px solid #e9ecef', 
                      borderRadius: '8px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '16px', fontWeight: '600', color: '#2c3e50' }}>
                            {booking.type} • {booking.route}
                          </div>
                          <div style={{ fontSize: '14px', color: '#6c757d', marginTop: '4px' }}>{booking.date}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '16px', fontWeight: '600', color: '#2c3e50' }}>₹{booking.amount}</div>
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

  return (
    <div className="container mt-4">
      <h2>Dashboard</h2>
      <p>Welcome {user?.name || user?.email || "User"}.</p>

      <div className="row">
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Bookings</h5>
              <p className="card-text">Your recent bookings will appear here.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-3" style={{ cursor: 'pointer' }} onClick={() => setShowProfile(true)}>
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
