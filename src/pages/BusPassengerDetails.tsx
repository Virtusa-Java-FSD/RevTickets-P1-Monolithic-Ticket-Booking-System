import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/passengerDetails.css';

interface Seat {
  id: string;
  number: string;
  deck: 'lower' | 'upper';
}

interface PassengerInfo {
  name: string;
  age: string;
  gender: 'male' | 'female' | 'other';
  idNumber: string;
}

const BusPassengerDetails: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [busName, setBusName] = useState('');
  const [passengers, setPassengers] = useState<PassengerInfo[]>([]);
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: ''
  });

  useEffect(() => {
    const seats = localStorage.getItem('selectedSeats');
    const bus = localStorage.getItem('busName');
    
    if (!seats || !bus) {
      navigate('/travels');
      return;
    }
    
    const parsedSeats = JSON.parse(seats);
    setSelectedSeats(parsedSeats);
    setBusName(bus);
    
    // Initialize passenger forms
    setPassengers(parsedSeats.map(() => ({
      name: '',
      age: '',
      gender: 'male' as const,
      idNumber: ''
    })));
  }, [navigate]);

  const updatePassenger = (index: number, field: keyof PassengerInfo, value: string) => {
    setPassengers(prev => prev.map((p, i) => 
      i === index ? { ...p, [field]: value } : p
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send data to backend
    console.log('Booking data:', { passengers, contactInfo, selectedSeats, busName });
    alert('Booking confirmed! Redirecting to payment...');
    navigate('/travels');
  };

  const totalPrice = selectedSeats.length * 1200;
  const taxes = totalPrice * 0.18;
  const finalPrice = totalPrice + taxes;

  return (
    <div className="passenger-details-page">
      <div className="container">
        <div className="passenger-details-container">
          <div className="page-header">
            <button className="back-btn" onClick={() => navigate('/travels')}>
              ← Back to Search
            </button>
            <h1>Passenger Details</h1>
          </div>

          <div className="booking-summary-card">
            <h3>Booking Summary</h3>
            <div className="summary-info">
              <div className="bus-details">
                <h4>{busName}</h4>
                <p>Selected Seats: {selectedSeats.map(s => s.number).join(', ')}</p>
              </div>
              <div className="price-summary">
                <div className="price-row">
                  <span>Base Fare ({selectedSeats.length} seats)</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="price-row">
                  <span>Taxes & Fees</span>
                  <span>₹{Math.round(taxes)}</span>
                </div>
                <div className="price-row total">
                  <span>Total Amount</span>
                  <span>₹{Math.round(finalPrice)}</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="passenger-form">
            <div className="passengers-section">
              <h3>Passenger Information</h3>
              {passengers.map((passenger, index) => (
                <div key={index} className="passenger-card">
                  <h4>Passenger {index + 1} - Seat {selectedSeats[index]?.number}</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        required
                        value={passenger.name}
                        onChange={(e) => updatePassenger(index, 'name', e.target.value)}
                        placeholder="Enter full name as per ID"
                      />
                    </div>
                    <div className="form-group">
                      <label>Age *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="120"
                        value={passenger.age}
                        onChange={(e) => updatePassenger(index, 'age', e.target.value)}
                        placeholder="Age"
                      />
                    </div>
                    <div className="form-group">
                      <label>Gender *</label>
                      <select
                        required
                        value={passenger.gender}
                        onChange={(e) => updatePassenger(index, 'gender', e.target.value as any)}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>ID/Aadhaar Number *</label>
                      <input
                        type="text"
                        required
                        value={passenger.idNumber}
                        onChange={(e) => updatePassenger(index, 'idNumber', e.target.value)}
                        placeholder="Enter Aadhaar or ID number"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="contact-section">
              <h3>Contact Information</h3>
              <div className="contact-card">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      required
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={() => navigate('/travels')}>
                Cancel
              </button>
              <button type="submit" className="btn-proceed">
                Proceed to Payment (₹{Math.round(finalPrice)})
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BusPassengerDetails;