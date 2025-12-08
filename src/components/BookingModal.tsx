import React, { useState } from 'react';
import type { Event } from '../types/Event';

interface BookingModalProps {
  movie: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

// Promo codes database
const PROMO_CODES: { [key: string]: { discount: number; type: 'percentage' | 'fixed' } } = {
  'SAVE20': { discount: 20, type: 'percentage' },
  'FIRST100': { discount: 100, type: 'fixed' },
  'WEEKEND50': { discount: 50, type: 'fixed' },
  'MOVIE30': { discount: 30, type: 'percentage' },
};

export const BookingModal: React.FC<BookingModalProps> = ({ movie, isOpen, onClose }) => {
  const [selectedShowtime, setSelectedShowtime] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number>(0);
  const [selectedFormat, setSelectedFormat] = useState<'2D' | '3D'>('2D');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'wallet'>('upi');

  if (!isOpen || !movie) return null;

  const pricePerSeat = selectedFormat === '3D' ? 250 : 200;
  const subtotal = selectedSeats * pricePerSeat;
  const convenienceFee = subtotal > 0 ? 50 : 0;
  let discount = 0;

  if (appliedPromo) {
    if (appliedPromo.discount > 0) {
      discount =
        PROMO_CODES[appliedPromo.code]?.type === 'percentage'
          ? (subtotal * appliedPromo.discount) / 100
          : appliedPromo.discount;
    }
  }

  const taxableAmount = subtotal - discount + convenienceFee;
  const taxes = Math.round(taxableAmount * 0.18);
  const finalPrice = taxableAmount + taxes;

  const handleSeatToggle = (count: number) => {
    setSelectedSeats(selectedSeats === count ? 0 : count);
  };

  const handleApplyPromo = () => {
    const upperPromo = promoCode.toUpperCase().trim();
    if (!upperPromo) {
      setPromoError('Please enter a promo code');
      return;
    }

    if (PROMO_CODES[upperPromo]) {
      setAppliedPromo({
        code: upperPromo,
        discount: PROMO_CODES[upperPromo].discount,
      });
      setPromoError('');
      setPromoCode('');
    } else {
      setPromoError('Invalid promo code');
      setAppliedPromo(null);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
  };

  const handleProceedToPayment = () => {
    if (!selectedShowtime || selectedSeats === 0) {
      alert('Please select showtime and seats');
      return;
    }

    const bookingDetails = {
      movie: movie.title,
      time: selectedShowtime,
      seats: selectedSeats,
      format: selectedFormat,
      subtotal,
      discount,
      convenienceFee,
      taxes,
      total: finalPrice,
      promoCode: appliedPromo?.code || 'None',
      paymentMethod,
    };

    alert(
      `✅ Booking Confirmed!\n\n` +
        `Movie: ${bookingDetails.movie}\n` +
        `Time: ${bookingDetails.time}\n` +
        `Format: ${bookingDetails.format}\n` +
        `Seats: ${bookingDetails.seats}\n` +
        `Payment Method: ${bookingDetails.paymentMethod.toUpperCase()}\n` +
        `\nTotal: ₹${bookingDetails.total}\n\n` +
        `Proceed to ${bookingDetails.paymentMethod.toUpperCase()} payment`
    );
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'flex-end',
            zIndex: 1000,
          }}
          onClick={onClose}
        >
          <div
            style={{
              background: 'white',
              width: '100%',
              maxWidth: '100%',
              borderRadius: '1rem 1rem 0 0',
              maxHeight: '90vh',
              overflowY: 'auto',
              animation: 'slideUp 0.3s ease',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                borderBottom: '1px solid #eee',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                position: 'sticky',
                top: 0,
              }}
            >
              <div>
                <h5 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>
                  {movie.title}
                </h5>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', opacity: 0.9 }}>
                  {movie.language} • {movie.duration} mins
                </p>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '1.2rem' }}>
              {/* Showtimes */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h6 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.6rem' }}>
                  Select Showtime
                </h6>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
                    gap: '0.6rem',
                  }}
                >
                  {movie.showtimes?.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedShowtime(time)}
                      style={{
                        padding: '0.6rem',
                        border: selectedShowtime === time ? 'none' : '1px solid #ddd',
                        background:
                          selectedShowtime === time
                            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            : 'white',
                        color: selectedShowtime === time ? 'white' : '#333',
                        borderRadius: '0.4rem',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        transition: 'all 0.2s',
                      }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format Selection */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h6 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.6rem' }}>
                  Select Format
                </h6>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  {['2D', '3D'].map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setSelectedFormat(fmt as '2D' | '3D')}
                      style={{
                        flex: 1,
                        padding: '0.6rem',
                        border: selectedFormat === fmt ? 'none' : '1px solid #ddd',
                        background:
                          selectedFormat === fmt
                            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            : 'white',
                        color: selectedFormat === fmt ? 'white' : '#333',
                        borderRadius: '0.4rem',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        transition: 'all 0.2s',
                      }}
                    >
                      {fmt} - ₹{fmt === '2D' ? '200' : '250'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seat Selection */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h6 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.6rem' }}>
                  Select Seats ({selectedSeats} selected)
                </h6>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '0.4rem',
                  }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleSeatToggle(num)}
                      style={{
                        padding: '0.5rem',
                        border: selectedSeats === num ? 'none' : '1px solid #ddd',
                        background:
                          selectedSeats === num
                            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            : 'white',
                        color: selectedSeats === num ? 'white' : '#333',
                        borderRadius: '0.3rem',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        transition: 'all 0.2s',
                      }}
                    >
                      {selectedSeats === num ? '✓' : 'A' + num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Promo Code Section */}
              <div style={{ marginBottom: '1.5rem', background: '#f9f9f9', padding: '1rem', borderRadius: '0.5rem' }}>
                <h6 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.6rem' }}>
                  🎟️ Apply Promo Code
                </h6>
                {appliedPromo ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#28a745', fontWeight: '600' }}>
                        ✓ {appliedPromo.code} applied
                      </p>
                      <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem', color: '#666' }}>
                        Save {appliedPromo.discount}
                        {PROMO_CODES[appliedPromo.code]?.type === 'percentage' ? '%' : '₹'}
                      </p>
                    </div>
                    <button
                      onClick={handleRemovePromo}
                      style={{
                        background: 'white',
                        border: '1px solid #ddd',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '0.3rem',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        color: '#666',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value);
                        setPromoError('');
                      }}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        border: promoError ? '1px solid #dc3545' : '1px solid #ddd',
                        borderRadius: '0.3rem',
                        fontSize: '0.85rem',
                      }}
                    />
                    <button
                      onClick={handleApplyPromo}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#667eea',
                        border: 'none',
                        color: 'white',
                        borderRadius: '0.3rem',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                      }}
                    >
                      Apply
                    </button>
                  </div>
                )}
                {promoError && (
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#dc3545' }}>
                    {promoError}
                  </p>
                )}
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.7rem', color: '#999' }}>
                  💡 Try: SAVE20, FIRST100, WEEKEND50, MOVIE30
                </p>
              </div>

              {/* Payment Method */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h6 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.6rem' }}>
                  Payment Method
                </h6>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
                  {[
                    { id: 'upi', label: '📱 UPI', icon: '📱' },
                    { id: 'card', label: '💳 Card', icon: '💳' },
                    { id: 'wallet', label: '🎒 Wallet', icon: '🎒' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as 'upi' | 'card' | 'wallet')}
                      style={{
                        padding: '0.6rem',
                        border: paymentMethod === method.id ? '2px solid #667eea' : '1px solid #ddd',
                        background: paymentMethod === method.id ? '#f0f0ff' : 'white',
                        borderRadius: '0.4rem',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        transition: 'all 0.2s',
                      }}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Summary */}
              {selectedSeats > 0 && (
                <div
                  style={{
                    background: '#f5f5f5',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    marginBottom: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                    <span>Ticket ({selectedSeats} × ₹{pricePerSeat})</span>
                    <span>₹{subtotal}</span>
                  </div>
                  {appliedPromo && discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem', color: '#28a745' }}>
                      <span>Discount ({appliedPromo.code})</span>
                      <span>-₹{Math.round(discount)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                    <span>Convenience Fee</span>
                    <span>₹{convenienceFee}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <span>Taxes (18%)</span>
                    <span>₹{taxes}</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.95rem',
                      fontWeight: '700',
                      borderTop: '2px solid #ddd',
                      paddingTop: '0.5rem',
                      color: '#667eea',
                    }}
                  >
                    <span>Total</span>
                    <span>₹{finalPrice}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button
                  onClick={onClose}
                  style={{
                    flex: 1,
                    padding: '0.8rem',
                    border: '1px solid #ddd',
                    background: 'white',
                    borderRadius: '0.4rem',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#666',
                    transition: 'all 0.2s',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleProceedToPayment}
                  disabled={!selectedShowtime || selectedSeats === 0}
                  style={{
                    flex: 1,
                    padding: '0.8rem',
                    border: 'none',
                    background:
                      !selectedShowtime || selectedSeats === 0
                        ? '#ccc'
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '0.4rem',
                    cursor: !selectedShowtime || selectedSeats === 0 ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: 'white',
                    transition: 'all 0.2s',
                  }}
                >
                  Pay ₹{selectedSeats > 0 ? finalPrice : 0}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

