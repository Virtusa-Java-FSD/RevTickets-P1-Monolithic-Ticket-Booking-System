import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const TrainClassSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state || {};
  
  const [selectedClass, setSelectedClass] = useState('');

  const classes = [
    { id: '1AC', name: 'First AC (1AC)', price: 3500, available: 12 },
    { id: '2AC', name: 'Second AC (2AC)', price: 2800, available: 24 },
    { id: '3AC', name: 'Third AC (3AC)', price: 2000, available: 36 },
    { id: 'SL', name: 'Sleeper (SL)', price: 800, available: 48 },
    { id: 'GN', name: 'General', price: 300, available: 100 }
  ];

  const handleContinue = () => {
    if (!selectedClass) {
      alert('Please select a class');
      return;
    }

    const selected = classes.find(c => c.id === selectedClass);
    navigate('/booking-details', {
      state: {
        ...bookingData,
        trainClass: selected,
        price: selected?.price || bookingData.price
      }
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <button 
            onClick={() => navigate('/travels')}
            style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '14px', cursor: 'pointer', marginBottom: '10px' }}
          >
            ← Back
          </button>
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
            Select Class
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            {bookingData.name} • {bookingData.route} • {bookingData.departure}
          </p>
        </div>

        {/* Class Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {classes.map(cls => (
            <div
              key={cls.id}
              onClick={() => setSelectedClass(cls.id)}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                border: selectedClass === cls.id ? '2px solid #3b82f6' : '2px solid transparent',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                    {cls.name}
                  </div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>
                    {cls.available} seats available
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                    ₹{cls.price}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    per person
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        {selectedClass && (
          <button
            onClick={handleContinue}
            style={{
              width: '100%',
              marginTop: '20px',
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
            Continue
          </button>
        )}
      </div>
    </div>
  );
};

export default TrainClassSelection;
