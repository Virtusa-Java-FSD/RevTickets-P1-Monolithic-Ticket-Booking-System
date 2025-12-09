import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/payment.css";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { seats, total } = location.state || { seats: [], total: 0 };
  
  const [selectedMethod, setSelectedMethod] = useState("");
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);

  const paymentMethods = [
    { id: "upi", name: "UPI", icon: "📱", desc: "Google Pay, PhonePe, Paytm" },
    { id: "card", name: "Credit/Debit Card", icon: "💳", desc: "Visa, Mastercard, Rupay" },
    { id: "netbanking", name: "Net Banking", icon: "🏦", desc: "All major banks" },
    { id: "wallet", name: "Wallets", icon: "👛", desc: "Paytm, PhonePe, Amazon Pay" },
  ];

  const handleProceedToPayment = () => {
    setShowPaymentMethods(true);
  };

  const handlePayment = () => {
    if (!selectedMethod) {
      alert("Please select a payment method");
      return;
    }
    
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setPaymentSuccess(true);
    }, 2000);
  };

  if (paymentSuccess) {
    return (
      <div className="payment-page">
        <div className="container py-5">
          <div className="text-center">
            <div style={{ fontSize: '4rem', color: '#10b981' }}>✓</div>
            <h2 className="mt-3">Payment Successful!</h2>
            <p className="text-muted">Your booking has been confirmed.</p>
            <div className="mt-4">
              <p><strong>Seats:</strong> {seats.join(", ")}</p>
              <p><strong>Amount Paid:</strong> ₹{total}</p>
            </div>
            <button className="btn btn-danger mt-4" onClick={() => navigate("/movies")}>
              Book More Tickets
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-header">
        <div className="container">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M5 12L12 19M5 12L12 5"/>
            </svg>
          </button>
          <h5 className="mb-0">Payment</h5>
        </div>
      </div>

      <div className="container py-4">
        {!showPaymentMethods ? (
          <div className="text-center py-5">
            <h3 className="mb-4 text-white fw-bold">Review Your Booking</h3>
            <div className="booking-summary-card mx-auto" style={{ maxWidth: '450px' }}>
              <div className="summary-item">
                <span>Selected Seats</span>
                <span className="fw-bold">{seats.join(", ")}</span>
              </div>
              <div className="summary-item">
                <span>Number of Seats</span>
                <span className="fw-bold">{seats.length}</span>
              </div>
              <hr />
              <div className="summary-item total">
                <span>Total Amount</span>
                <span className="fw-bold">₹{total}</span>
              </div>
              <button
                className="btn btn-danger w-100 mt-3"
                onClick={handleProceedToPayment}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="payment-methods">
              <h6>Select Payment Method</h6>
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`payment-method-card ${selectedMethod === method.id ? "selected" : ""}`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <div className="method-icon">{method.icon}</div>
                  <div className="method-info">
                    <h6 className="mb-0">{method.name}</h6>
                    <p className="small text-muted mb-0">{method.desc}</p>
                  </div>
                  <div className="method-radio">
                    <input
                      type="radio"
                      checked={selectedMethod === method.id}
                      onChange={() => setSelectedMethod(method.id)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {selectedMethod === "upi" && (
              <div className="payment-form">
                <label className="form-label fw-semibold">Enter UPI ID</label>
                <input type="text" className="form-control" placeholder="yourname@upi" />
              </div>
            )}

            {selectedMethod === "card" && (
              <div className="payment-form">
                <label className="form-label fw-semibold">Card Details</label>
                <input type="text" className="form-control mb-3" placeholder="Card Number" />
                <div className="row g-3">
                  <div className="col-6">
                    <input type="text" className="form-control" placeholder="MM/YY" />
                  </div>
                  <div className="col-6">
                    <input type="text" className="form-control" placeholder="CVV" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="col-lg-4">
            <div className="booking-summary-card">
              <h6 className="mb-3">Booking Summary</h6>
              <div className="summary-item">
                <span>Selected Seats</span>
                <span className="fw-bold">{seats.join(", ")}</span>
              </div>
              <div className="summary-item">
                <span>Number of Seats</span>
                <span className="fw-bold">{seats.length}</span>
              </div>
              <hr />
              <div className="summary-item total">
                <span>Total Amount</span>
                <span className="fw-bold">₹{total}</span>
              </div>
              <button
                className="btn btn-danger w-100 mt-3"
                onClick={handlePayment}
                disabled={processing}
              >
                {processing ? "Processing..." : `Pay ₹${total}`}
              </button>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
