import React, { useState } from 'react';
import type { BookingDetails, PassengerDetails } from '../types/Travel';

interface TravelBookingProps {
  bookingDetails: BookingDetails;
  onConfirm: (booking: BookingDetails) => void;
  onCancel: () => void;
}

const TravelBooking: React.FC<TravelBookingProps> = ({ bookingDetails, onConfirm, onCancel }) => {
  const [passengers, setPassengers] = useState<PassengerDetails[]>([
    { id: '1', name: '', age: 0, gender: 'male' }
  ]);
  const [contactDetails, setContactDetails] = useState({
    email: '',
    phone: '',
    emergencyContact: ''
  });

  const addPassenger = () => {
    const newPassenger: PassengerDetails = {
      id: Date.now().toString(),
      name: '',
      age: 0,
      gender: 'male'
    };
    setPassengers([...passengers, newPassenger]);
  };

  const updatePassenger = (id: string, field: keyof PassengerDetails, value: any) => {
    setPassengers(passengers.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const removePassenger = (id: string) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter(p => p.id !== id));
    }
  };

  const handleConfirm = () => {
    const updatedBooking: BookingDetails = {
      ...bookingDetails,
      passengers,
      totalAmount: calculateTotal()
    };
    onConfirm(updatedBooking);
  };

  const calculateTotal = () => {
    const basePrice = bookingDetails.type === 'bus' && bookingDetails.selectedSeats 
      ? bookingDetails.selectedSeats.length * 1200
      : passengers.length * 2000; // Default pricing
    
    const taxes = basePrice * 0.18; // 18% GST
    return basePrice + taxes;
  };

  return (
    <div className="booking-confirmation">
      <div className="booking-header">
        <h3>Complete Your Booking</h3>
        <button className="close-btn" onClick={onCancel}>×</button>
      </div>

      <div className="booking-content">
        <div className="booking-summary">
          <h4>Booking Summary</h4>
          <div className="summary-card">
            {bookingDetails.type === 'flight' && (
              <div className="flight-summary">
                <div className="route">
                  <span>{bookingDetails.searchData.from}</span>
                  <span className="arrow">→</span>
                  <span>{bookingDetails.searchData.to}</span>
                </div>
                <div className="date">{bookingDetails.searchData.date}</div>
                <div className="passengers">{bookingDetails.searchData.passengers} Passenger(s)</div>
              </div>
            )}
            
            {bookingDetails.type === 'bus' && (
              <div className="bus-summary">
                <div className="route">
                  <span>{bookingDetails.searchData.from}</span>
                  <span className="arrow">→</span>
                  <span>{bookingDetails.searchData.to}</span>
                </div>
                <div className="date">{bookingDetails.searchData.date}</div>
                {bookingDetails.selectedSeats && (
                  <div className="selected-seats">
                    Seats: {bookingDetails.selectedSeats.map(s => s.number).join(', ')}
                  </div>
                )}
              </div>
            )}
            
            {bookingDetails.type === 'train' && (
              <div className="train-summary">
                <div className="route">
                  <span>{bookingDetails.searchData.from}</span>
                  <span className="arrow">→</span>
                  <span>{bookingDetails.searchData.to}</span>
                </div>
                <div className="date">{bookingDetails.searchData.date}</div>
                <div className="passengers">{bookingDetails.searchData.passengers} Passenger(s)</div>
              </div>
            )}
          </div>
        </div>

        <div className="passenger-details">
          <h4>Passenger Details</h4>
          {passengers.map((passenger, index) => (
            <div key={passenger.id} className="passenger-form">
              <div className="passenger-header">
                <h5>Passenger {index + 1}</h5>
                {passengers.length > 1 && (
                  <button 
                    className="remove-passenger"
                    onClick={() => removePassenger(passenger.id)}
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={passenger.name}
                    onChange={(e) => updatePassenger(passenger.id, 'name', e.target.value)}
                    placeholder="Enter full name"
                  />
                </div>
                
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    className="form-control"
                    value={passenger.age || ''}
                    onChange={(e) => updatePassenger(passenger.id, 'age', parseInt(e.target.value))}
                    placeholder="Age"
                    min="1"
                    max="120"
                  />
                </div>
                
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    className="form-control"
                    value={passenger.gender}
                    onChange={(e) => updatePassenger(passenger.id, 'gender', e.target.value)}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
          
          <button className="add-passenger-btn" onClick={addPassenger}>
            + Add Another Passenger
          </button>
        </div>

        <div className="contact-details">
          <h4>Contact Details</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className="form-control"
                value={contactDetails.email}
                onChange={(e) => setContactDetails({...contactDetails, email: e.target.value})}
                placeholder="your@email.com"
              />
            </div>
            
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                className="form-control"
                value={contactDetails.phone}
                onChange={(e) => setContactDetails({...contactDetails, phone: e.target.value})}
                placeholder="+91 9876543210"
              />
            </div>
          </div>
        </div>

        <div className="payment-summary">
          <h4>Payment Summary</h4>
          <div className="price-breakdown">
            <div className="price-row">
              <span>Base Fare</span>
              <span>₹{Math.round(calculateTotal() / 1.18)}</span>
            </div>
            <div className="price-row">
              <span>Taxes & Fees</span>
              <span>₹{Math.round(calculateTotal() - (calculateTotal() / 1.18))}</span>
            </div>
            <div className="price-row total">
              <span>Total Amount</span>
              <span>₹{calculateTotal()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="booking-footer">
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleConfirm}>
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default TravelBooking;