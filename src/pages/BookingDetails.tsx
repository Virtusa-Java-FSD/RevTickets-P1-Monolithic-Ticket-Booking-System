import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BookingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state || {};

  const [currentStep, setCurrentStep] = useState(1);
  const selectedSeats = bookingData.selectedSeats || [];
  const initialPassengers = selectedSeats.length > 0
    ? selectedSeats.map(() => ({
      title: 'Mr',
      firstName: '',
      lastName: '',
      nationality: 'India',
      dob: '',
      age: '',
      gender: 'Male',
      noLastName: false,
      aadhaar: '',
      passport: '',
      berthPreference: 'Lower'
    }))
    : [{
      title: 'Mr',
      firstName: '',
      lastName: '',
      nationality: 'India',
      dob: '',
      age: '',
      gender: 'Male',
      noLastName: false,
      aadhaar: '',
      passport: '',
      berthPreference: 'Lower'
    }];

  const [passengers, setPassengers] = useState(initialPassengers);
  const [aadhaarErrors, setAadhaarErrors] = useState<{ [key: number]: string }>({});
  const [passportErrors, setPassportErrors] = useState<{ [key: number]: string }>({});
  const [validationErrors, setValidationErrors] = useState<{ [key: number]: { [key: string]: string } }>({});
  const [contact, setContact] = useState({ email: '', phone: '' });
  const [addOns, setAddOns] = useState({ baggage: false, seat: false });

  const steps = ['Booking', 'Add-ons', 'Payment', 'Complete'];

  const addPassenger = () => {
    setPassengers([...passengers, {
      title: 'Mr',
      firstName: '',
      lastName: '',
      nationality: 'India',
      dob: '',
      age: '',
      gender: 'Male',
      noLastName: false,
      aadhaar: '',
      passport: '',
      berthPreference: 'Lower'
    }]);
  };

  const removePassenger = (index: number) => {
    if (index === 0) return;
    setPassengers(passengers.filter((_, i) => i !== index));
  };

  const updatePassenger = (index: number, field: string, value: any) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);

    if (field === 'aadhaar') {
      validateAadhaar(index, value);
    }
    if (field === 'passport') {
      validatePassport(index, value);
    }
  };

  const validateAadhaar = (index: number, value: string) => {
    const errors = { ...aadhaarErrors };
    if (!value) {
      errors[index] = 'Aadhaar number is required';
    } else if (!/^\d{12}$/.test(value)) {
      errors[index] = 'Enter a valid 12-digit Aadhaar number.';
    } else {
      delete errors[index];
    }
    setAadhaarErrors(errors);
  };

  const validatePassport = (index: number, value: string) => {
    const errors = { ...passportErrors };
    if (isFlight && !value) {
      errors[index] = 'Passport number is required.';
    } else if (value && (!/^[A-Z0-9]{6,9}$/.test(value))) {
      errors[index] = 'Enter a valid passport number (6-9 alphanumeric characters)';
    } else {
      delete errors[index];
    }
    setPassportErrors(errors);
  };

  const validateAllFields = () => {
    const errors: { [key: number]: { [key: string]: string } } = {};
    let isValid = true;

    passengers.forEach((passenger, index) => {
      errors[index] = {};

      if (!passenger.firstName.trim()) {
        errors[index].firstName = 'First name is required';
        isValid = false;
      }
      if (!passenger.noLastName && !passenger.lastName.trim()) {
        errors[index].lastName = 'Last name is required';
        isValid = false;
      }
      if (isFlight && !passenger.dob) {
        errors[index].dob = 'Date of birth is required';
        isValid = false;
      }
      if ((isBus || isTrain) && !passenger.age) {
        errors[index].age = 'Age is required';
        isValid = false;
      }
      if (isFlight && !passenger.passport.trim()) {
        errors[index].passport = 'Passport number is required.';
        isValid = false;
      }
      if (!passenger.aadhaar.trim()) {
        errors[index].aadhaar = 'Aadhaar number is required';
        isValid = false;
      } else if (passenger.aadhaar.length !== 12) {
        errors[index].aadhaar = 'Enter a valid 12-digit Aadhaar number.';
        isValid = false;
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  const handleContinue = () => {
    if (currentStep === 1) {
      if (!validateAllFields()) {
        return;
      }
    }

    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
      scrollToStep(currentStep + 1);
    } else {
      // Go to Payment Page immediately
      navigate('/payment', {
        state: {
          total: calculateTotal(),
          seats: selectedSeats.length > 0 ? selectedSeats.map((_, i) => `P${i + 1}`) : [], // Mock seats or use passenger count
          bookingType: bookingData.type ? bookingData.type.toUpperCase() : 'TRAVEL',
          travelId: bookingData.id,
          bookingData: bookingData,
          passengers: passengers
        }
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      scrollToStep(currentStep - 1);
    }
  };

  const scrollToStep = (step: number) => {
    const sectionIds = ['booking-section', 'addons-section', 'payment-section', 'complete-section'];
    const element = document.getElementById(sectionIds[step - 1]);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const isBookingValid = () => {
    let isValid = true;
    passengers.forEach((passenger) => {
      if (!passenger.firstName.trim()) isValid = false;
      if (!passenger.noLastName && !passenger.lastName.trim()) isValid = false;
      if (isFlight && !passenger.dob) isValid = false;
      if ((isBus || isTrain) && !passenger.age) isValid = false;
      if (isFlight && !passenger.passport.trim()) isValid = false;
      if (!passenger.aadhaar.trim() || passenger.aadhaar.length !== 12) isValid = false;
    });
    return isValid;
  };

  const handleStepClick = (step: number) => {
    if (step > 1 && !isBookingValid()) {
      validateAllFields();
      return;
    }
    setCurrentStep(step);
    scrollToStep(step);
  };

  const calculateTotal = () => {
    let total = bookingData.totalPrice || bookingData.price || 0;
    if (bookingData.type !== 'train' && addOns.baggage) total += 500;
    if (addOns.seat) total += 200;
    return total;
  };

  const isBus = bookingData.type === 'bus';
  const isTrain = bookingData.type === 'train';
  const isFlight = bookingData.type === 'flight';

  const requiresAadhaar = isBus || isTrain;

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '30px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>

        {/* Back Button */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <button
            onClick={() => currentStep === 1 ? (bookingData.type === 'train' ? navigate('/train-class-selection', { state: bookingData }) : navigate('/travels')) : handleBack()}
            style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              padding: '10px 20px',
              borderRadius: '8px',
              color: '#3b82f6',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ← Back
          </button>
          {currentStep > 1 && (
            <span style={{ padding: '10px 0', color: '#6b7280', fontSize: '14px' }}>
              Step {currentStep} of 4
            </span>
          )}
        </div>

        {/* Progress Steps */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'sticky', top: '0', zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {steps.map((step, index) => {
              const isDisabled = index > 0 && !isBookingValid();
              return (
                <div key={index} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <div
                      onClick={() => handleStepClick(index + 1)}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '600',
                        background: isDisabled ? '#d1d5db' : (index + 1 === currentStep ? '#3b82f6' : index + 1 < currentStep ? '#10b981' : '#e5e7eb'),
                        color: isDisabled ? '#9ca3af' : (index + 1 <= currentStep ? 'white' : '#9ca3af'),
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease',
                        border: index + 1 === currentStep ? '3px solid #60a5fa' : 'none',
                        opacity: isDisabled ? 0.5 : 1
                      }}>
                      {index + 1}
                    </div>
                    <span style={{
                      marginTop: '8px',
                      fontSize: '14px',
                      fontWeight: index + 1 <= currentStep ? '600' : '400',
                      color: isDisabled ? '#9ca3af' : (index + 1 <= currentStep ? '#3b82f6' : '#9ca3af'),
                      opacity: isDisabled ? 0.5 : 1
                    }}>
                      {step}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div style={{
                      height: '2px',
                      flex: 1,
                      margin: '0 8px',
                      background: index + 1 < currentStep ? '#3b82f6' : '#e5e7eb'
                    }} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>

          {/* Left Side - Forms */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Passenger Details */}
            <div id="booking-section" style={{ scrollMarginTop: '100px' }}>
              {currentStep === 1 && (
                <>
                  {passengers.map((passenger, index) => (
                    <div key={index} style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                          Passenger {index + 1} {selectedSeats[index] && `- Seat ${selectedSeats[index].id}`}
                        </h3>
                        {index > 0 && (
                          <button
                            onClick={() => removePassenger(index)}
                            style={{
                              background: '#dc2626',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '8px 12px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: '500',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                            Title
                          </label>
                          <select
                            value={passenger.title}
                            onChange={(e) => updatePassenger(index, 'title', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              border: '1px solid #d1d5db',
                              borderRadius: '8px',
                              fontSize: '14px',
                              background: 'white',
                              color: '#1f2937',
                              outline: 'none'
                            }}
                          >
                            <option>Mr</option>
                            <option>Ms</option>
                            <option>Mrs</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                            First/Given Name
                          </label>
                          <input
                            type="text"
                            value={passenger.firstName}
                            onChange={(e) => updatePassenger(index, 'firstName', e.target.value)}
                            placeholder="Enter first name"
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              border: validationErrors[index]?.firstName ? '2px solid #dc2626' : '1px solid #d1d5db',
                              borderRadius: '8px',
                              fontSize: '14px',
                              background: 'white',
                              color: '#1f2937',
                              outline: 'none'
                            }}
                          />
                          {validationErrors[index]?.firstName && (
                            <span style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px', display: 'block' }}>
                              {validationErrors[index].firstName}
                            </span>
                          )}
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                            Last/Surname
                          </label>
                          <input
                            type="text"
                            value={passenger.lastName}
                            onChange={(e) => updatePassenger(index, 'lastName', e.target.value)}
                            disabled={passenger.noLastName}
                            placeholder="Enter last name"
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              border: validationErrors[index]?.lastName ? '2px solid #dc2626' : '1px solid #d1d5db',
                              borderRadius: '8px',
                              fontSize: '14px',
                              background: passenger.noLastName ? '#f9fafb' : 'white',
                              color: '#1f2937',
                              outline: 'none'
                            }}
                          />
                          {validationErrors[index]?.lastName && (
                            <span style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px', display: 'block' }}>
                              {validationErrors[index].lastName}
                            </span>
                          )}
                          <label style={{ display: 'flex', alignItems: 'center', marginTop: '8px', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={passenger.noLastName}
                              onChange={(e) => updatePassenger(index, 'noLastName', e.target.checked)}
                              style={{ marginRight: '6px' }}
                            />
                            <span style={{ fontSize: '13px', color: '#6b7280' }}>Without last name / surname</span>
                          </label>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                            Gender
                          </label>
                          <select
                            value={passenger.gender}
                            onChange={(e) => updatePassenger(index, 'gender', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              border: '1px solid #d1d5db',
                              borderRadius: '8px',
                              fontSize: '14px',
                              background: 'white',
                              color: '#1f2937',
                              outline: 'none'
                            }}
                          >
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                            Nationality
                          </label>
                          <select
                            value={passenger.nationality}
                            onChange={(e) => updatePassenger(index, 'nationality', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              border: '1px solid #d1d5db',
                              borderRadius: '8px',
                              fontSize: '14px',
                              background: 'white',
                              color: '#1f2937',
                              outline: 'none'
                            }}
                          >
                            <option>India</option>
                            <option>USA</option>
                            <option>UK</option>
                            <option>Canada</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                            {isBus || isTrain ? 'Age' : 'Date of Birth'}
                          </label>
                          {isBus || isTrain ? (
                            <input
                              type="number"
                              value={passenger.age}
                              onChange={(e) => updatePassenger(index, 'age', e.target.value)}
                              placeholder="Enter age"
                              min="1"
                              max="120"
                              style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '14px',
                                background: 'white',
                                color: '#1f2937',
                                outline: 'none'
                              }}
                            />
                          ) : (
                            <>
                              <input
                                type="date"
                                value={passenger.dob}
                                onChange={(e) => updatePassenger(index, 'dob', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '10px 12px',
                                  border: validationErrors[index]?.dob ? '2px solid #dc2626' : '1px solid #d1d5db',
                                  borderRadius: '8px',
                                  fontSize: '14px',
                                  background: 'white',
                                  color: '#1f2937',
                                  outline: 'none'
                                }}
                              />
                              {validationErrors[index]?.dob && (
                                <span style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px', display: 'block' }}>
                                  {validationErrors[index].dob}
                                </span>
                              )}
                            </>
                          )}
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                            Aadhaar Number <span style={{ color: '#dc2626' }}>*</span>
                          </label>
                          <input
                            type="text"
                            value={passenger.aadhaar}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 12);
                              updatePassenger(index, 'aadhaar', value);
                            }}
                            placeholder="Enter 12-digit Aadhaar number"
                            maxLength={12}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              border: (aadhaarErrors[index] || validationErrors[index]?.aadhaar) ? '2px solid #dc2626' : '1px solid #d1d5db',
                              borderRadius: '8px',
                              fontSize: '14px',
                              background: 'white',
                              color: '#1f2937',
                              outline: 'none'
                            }}
                          />
                          {(aadhaarErrors[index] || validationErrors[index]?.aadhaar) && (
                            <span style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px', display: 'block' }}>
                              {aadhaarErrors[index] || validationErrors[index]?.aadhaar}
                            </span>
                          )}
                        </div>

                        {isFlight && (
                          <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                              Passport Number <span style={{ color: '#dc2626' }}>*</span>
                            </label>
                            <input
                              type="text"
                              value={passenger.passport}
                              onChange={(e) => {
                                const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 9);
                                updatePassenger(index, 'passport', value);
                              }}
                              placeholder="Enter passport number"
                              maxLength={9}
                              style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: (passportErrors[index] || validationErrors[index]?.passport) ? '2px solid #dc2626' : '1px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '14px',
                                background: 'white',
                                color: '#1f2937',
                                outline: 'none'
                              }}
                            />
                            {(passportErrors[index] || validationErrors[index]?.passport) && (
                              <span style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px', display: 'block' }}>
                                {passportErrors[index] || validationErrors[index]?.passport}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {!selectedSeats.length && (
                    <button
                      onClick={addPassenger}
                      style={{
                        width: '100%',
                        padding: '14px',
                        border: '2px dashed #d1d5db',
                        borderRadius: '12px',
                        background: 'white',
                        color: '#3b82f6',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      + Add Another Passenger
                    </button>
                  )}

                  {/* Contact Details */}
                  <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#1f2937' }}>
                      Contact Details
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                          Email
                        </label>
                        <input
                          type="email"
                          value={contact.email}
                          onChange={(e) => setContact({ ...contact, email: e.target.value })}
                          placeholder="your@email.com"
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                            background: 'white',
                            color: '#1f2937',
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
                          value={contact.phone}
                          onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                          placeholder="+91 1234567890"
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                            background: 'white',
                            color: '#1f2937',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Add-ons */}
            <div id="addons-section" style={{ scrollMarginTop: '100px' }}>
              {currentStep === 2 && (
                <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#1f2937' }}>Add-ons</h3>

                  {isTrain ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                          Berth Preference
                        </label>
                        {passengers.map((passenger, index) => (
                          <div key={index} style={{ marginBottom: '12px' }}>
                            <label style={{ fontSize: '13px', color: '#6b7280', marginBottom: '6px', display: 'block' }}>
                              Passenger {index + 1}
                            </label>
                            <select
                              value={passenger.berthPreference}
                              onChange={(e) => updatePassenger(index, 'berthPreference', e.target.value)}
                              style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '14px',
                                background: 'white',
                                color: '#1f2937',
                                outline: 'none'
                              }}
                            >
                              <option>Lower Berth</option>
                              <option>Middle Berth</option>
                              <option>Upper Berth</option>
                              <option>Side Lower</option>
                              <option>Side Upper</option>
                            </select>
                          </div>
                        ))}
                      </div>
                      <p style={{ fontSize: '13px', color: '#6b7280', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                        ℹ️ Note: Extra baggage is not available for train bookings. Berth preferences are subject to availability.
                      </p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {(isFlight || isBus) && (
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '16px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}>
                          <div>
                            <div style={{ fontWeight: '600', color: '#1f2937' }}>Extra Baggage</div>
                            <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>Add 15kg extra baggage - ₹500</div>
                          </div>
                          <input
                            type="checkbox"
                            checked={addOns.baggage}
                            onChange={(e) => setAddOns({ ...addOns, baggage: e.target.checked })}
                            style={{ width: '20px', height: '20px' }}
                          />
                        </label>
                      )}

                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}>
                        <div>
                          <div style={{ fontWeight: '600', color: '#1f2937' }}>Seat Selection</div>
                          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>Choose your preferred seat - ₹200</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={addOns.seat}
                          onChange={(e) => setAddOns({ ...addOns, seat: e.target.checked })}
                          style={{ width: '20px', height: '20px' }}
                        />
                      </label>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Payment */}
            <div id="payment-section" style={{ scrollMarginTop: '100px' }}>
              {currentStep === 3 && (
                <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#1f2937' }}>Payment Details</h3>
                  <p style={{ color: '#6b7280' }}>Redirecting to secure payment gateway...</p>
                  <button
                    onClick={() => navigate('/payment', {
                      state: {
                        total: calculateTotal(),
                        seats: selectedSeats.length > 0 ? selectedSeats.map((_, i) => `P${i + 1}`) : [],
                        bookingType: bookingData.type ? bookingData.type.toUpperCase() : 'TRAVEL',
                        travelId: bookingData.id,
                        bookingData: bookingData,
                        passengers: passengers
                      }
                    })}
                    className="btn btn-primary mt-3"
                  >
                    Click here if not redirected
                  </button>
                </div>
              )}
            </div>

            {/* Complete */}
            <div id="complete-section" style={{ scrollMarginTop: '100px' }}>
              {currentStep === 4 && (
                <div style={{ background: 'white', borderRadius: '12px', padding: '48px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '48px', color: 'white' }}>✓</div>
                  <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>Booking Confirmed!</h3>
                  <p style={{ color: '#6b7280', marginBottom: '24px' }}>Your booking has been successfully completed.</p>
                  <button
                    onClick={() => navigate('/dashboard')}
                    style={{
                      padding: '12px 32px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    View Booking
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Trip Summary */}
          <div>
            {currentStep !== 4 && (
              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'sticky', top: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#1f2937', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>
                  Trip Summary
                </h3>

                {bookingData.name ? (
                  <>
                    <div style={{ marginBottom: '20px' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                        {bookingData.name} — {bookingData.serviceType}
                      </h4>
                      {selectedSeats.length > 0 && (
                        <div style={{ marginTop: '8px', padding: '8px', background: '#f0f9ff', borderRadius: '6px' }}>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e40af', marginBottom: '4px' }}>Selected Seats:</div>
                          <div style={{ fontSize: '12px', color: '#1e40af' }}>
                            {selectedSeats.map((s: any) => s.id).join(', ')}
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #e5e7eb' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                        <span style={{ color: '#6b7280' }}>Route</span>
                        <span style={{ fontWeight: '600', color: '#1f2937' }}>{bookingData.route}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                        <span style={{ color: '#6b7280' }}>Departure</span>
                        <span style={{ fontWeight: '600', color: '#1f2937' }}>{bookingData.departure}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                        <span style={{ color: '#6b7280' }}>Arrival</span>
                        <span style={{ fontWeight: '600', color: '#1f2937' }}>{bookingData.arrival}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                        <span style={{ color: '#6b7280' }}>Duration</span>
                        <span style={{ fontWeight: '600', color: '#1f2937' }}>{bookingData.duration}</span>
                      </div>
                      {bookingData.trainClass && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                          <span style={{ color: '#6b7280' }}>Class</span>
                          <span style={{ fontWeight: '600', color: '#1f2937' }}>{bookingData.trainClass.name}</span>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                      {!isTrain && (
                        <span style={{ padding: '4px 10px', background: '#dbeafe', color: '#1e40af', borderRadius: '6px', fontSize: '12px', fontWeight: '500' }}>
                          ✔ Baggage
                        </span>
                      )}
                      <span style={{ padding: '4px 10px', background: '#d1fae5', color: '#065f46', borderRadius: '6px', fontSize: '12px', fontWeight: '500' }}>
                        ✔ Refundable
                      </span>
                      <span style={{ padding: '4px 10px', background: '#e9d5ff', color: '#6b21a8', borderRadius: '6px', fontSize: '12px', fontWeight: '500' }}>
                        ✔ Reschedulable
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #e5e7eb' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                        <span style={{ color: '#6b7280' }}>Base Fare</span>
                        <span style={{ color: '#1f2937' }}>₹{bookingData.totalPrice || bookingData.price}</span>
                      </div>
                      {!isTrain && addOns.baggage && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                          <span style={{ color: '#6b7280' }}>Extra Baggage</span>
                          <span style={{ color: '#1f2937' }}>₹500</span>
                        </div>
                      )}
                      {addOns.seat && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                          <span style={{ color: '#6b7280' }}>Seat Selection</span>
                          <span style={{ color: '#1f2937' }}>₹200</span>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>
                      <span style={{ color: '#1f2937' }}>Total</span>
                      <span style={{ color: '#1f2937' }}>₹{calculateTotal()}</span>
                    </div>
                  </>
                ) : (
                  <p style={{ color: '#6b7280', fontSize: '14px' }}>No booking selected</p>
                )}

                <button
                  onClick={handleContinue}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {currentStep === 4 ? 'View Booking' : 'Continue'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
