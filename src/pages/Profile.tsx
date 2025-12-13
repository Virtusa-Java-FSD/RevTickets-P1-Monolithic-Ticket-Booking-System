import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@example.com',
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

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '20px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '600', color: '#2c3e50', marginBottom: '8px' }}>
            My Profile
          </h2>
          <p style={{ color: '#6c757d', fontSize: '16px' }}>
            Manage your account information and view your booking history
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          
          {/* Left Column - Profile Info */}
          <div>
            {/* Profile Card */}
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
                  <p style={{ color: '#6c757d', margin: 0, fontSize: '14px' }}>
                    Member since January 2024
                  </p>
                </div>
              </div>

              {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={userInfo.name}
                      onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button
                      onClick={handleSave}
                      style={{
                        padding: '10px 20px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      style={{
                        padding: '10px 20px',
                        background: '#e5e7eb',
                        color: '#374151',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '12px', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Email
                    </label>
                    <p style={{ fontSize: '16px', color: '#2c3e50', margin: '4px 0 0 0', fontWeight: '500' }}>
                      {userInfo.email}
                    </p>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '12px', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Phone Number
                    </label>
                    <p style={{ fontSize: '16px', color: '#2c3e50', margin: '4px 0 0 0', fontWeight: '500' }}>
                      {userInfo.phone}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    style={{
                      padding: '10px 20px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>

            {/* Upcoming Trips */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#2c3e50', marginBottom: '20px' }}>
                Upcoming Trips
              </h4>
              {mockUpcomingTrips.length > 0 ? (
                mockUpcomingTrips.map(trip => (
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
                        <div style={{ fontSize: '14px', color: '#6c757d', marginTop: '4px' }}>
                          {trip.date}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#28a745' }}>
                          ₹{trip.amount}
                        </div>
                        <div style={{ fontSize: '12px', color: '#28a745', marginTop: '2px' }}>
                          {trip.status}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: '#6c757d', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
                  No upcoming trips
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Booking History */}
          <div>
            <div style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#2c3e50', marginBottom: '20px' }}>
                Booking History
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {mockBookingHistory.map(booking => (
                  <div key={booking.id} style={{ 
                    padding: '15px', 
                    border: '1px solid #e9ecef', 
                    borderRadius: '8px',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#2c3e50' }}>
                          {booking.type} • {booking.route}
                        </div>
                        <div style={{ fontSize: '14px', color: '#6c757d', marginTop: '4px' }}>
                          {booking.date}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#2c3e50' }}>
                          ₹{booking.amount}
                        </div>
                        <div style={{ fontSize: '12px', color: '#28a745', marginTop: '2px' }}>
                          {booking.status}
                        </div>
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
};

export default Profile;