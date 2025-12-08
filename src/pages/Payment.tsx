import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface BookingData {
  eventId: string;
  eventTitle: string;
  tickets: number;
  price: number;
  date: string;
  category: string;
}

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    if (location.state?.bookingData) {
      setBookingData(location.state.bookingData);
    } else {
      navigate("/events");
    }
  }, [location.state, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateTransactionId = () => {
    return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    // Simulate payment processing with dummy transaction
    setTimeout(() => {
      const transactionId = generateTransactionId();
      const transactionData = {
        transactionId,
        eventTitle: bookingData?.eventTitle,
        tickets: bookingData?.tickets,
        amount: total,
        paymentMethod,
        status: 'SUCCESS',
        timestamp: new Date().toISOString(),
        email: formData.email,
        phone: formData.phone
      };
      
      // Store transaction in localStorage (dummy database)
      const existingTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      existingTransactions.push(transactionData);
      localStorage.setItem('transactions', JSON.stringify(existingTransactions));
      
      console.log('Dummy Transaction Created:', transactionData);
      setProcessing(false);
      
      // Navigate to success page with transaction details
      navigate('/payment-success', { state: { transactionData } });
    }, 2000);
  };

  if (!bookingData) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const total = bookingData.price * bookingData.tickets;

  return (
    <div className="payment-page bg-light min-vh-100">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">💳 Payment Details</h4>
              </div>
              <div className="card-body">
                <div className="row">
                  {/* Booking Summary */}
                  <div className="col-md-5">
                    <h5 className="mb-3">Booking Summary</h5>
                    <div className="bg-light p-3 rounded">
                      <h6 className="fw-bold">{bookingData.eventTitle}</h6>
                      <p className="small text-muted mb-2">
                        📅 {bookingData.date}<br/>
                        🏷️ {bookingData.category}<br/>
                        🎫 {bookingData.tickets} ticket(s)
                      </p>
                      <hr className="my-2"/>
                      <div className="d-flex justify-content-between">
                        <span>Price per ticket:</span>
                        <span>${bookingData.price}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Quantity:</span>
                        <span>{bookingData.tickets}</span>
                      </div>
                      <div className="d-flex justify-content-between fw-bold border-top pt-2 mt-2">
                        <span>Total:</span>
                        <span>${total}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Form */}
                  <div className="col-md-7">
                    <h5 className="mb-3">Payment Method</h5>
                    
                    {/* Payment Method Selection */}
                    <div className="mb-3">
                      <div className="btn-group w-100" role="group">
                        <input 
                          type="radio" 
                          className="btn-check" 
                          name="paymentMethod" 
                          id="card" 
                          value="card"
                          checked={paymentMethod === "card"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <label className="btn btn-outline-primary" htmlFor="card">
                          💳 Credit Card
                        </label>
                        
                        <input 
                          type="radio" 
                          className="btn-check" 
                          name="paymentMethod" 
                          id="upi" 
                          value="upi"
                          checked={paymentMethod === "upi"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <label className="btn btn-outline-primary" htmlFor="upi">
                          📱 UPI
                        </label>
                      </div>
                    </div>

                    <form onSubmit={handlePayment}>
                      {paymentMethod === "card" && (
                        <>
                          <div className="row mb-3">
                            <div className="col-12">
                              <label className="form-label">Card Number</label>
                              <input
                                type="text"
                                className="form-control"
                                name="cardNumber"
                                placeholder="Enter any 16 digits (Dummy Payment)"
                                value={formData.cardNumber}
                                onChange={handleInputChange}
                                required
                              />
                              <small className="text-warning fw-bold">⚠️ This is a dummy payment system - No real money will be charged</small>
                            </div>
                          </div>
                          <div className="row mb-3">
                            <div className="col-6">
                              <label className="form-label">Expiry Date</label>
                              <input
                                type="text"
                                className="form-control"
                                name="expiryDate"
                                placeholder="MM/YY (Dummy)"
                                value={formData.expiryDate}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            <div className="col-6">
                              <label className="form-label">CVV</label>
                              <input
                                type="text"
                                className="form-control"
                                name="cvv"
                                placeholder="Any 3 digits (Dummy)"
                                value={formData.cvv}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Cardholder Name</label>
                            <input
                              type="text"
                              className="form-control"
                              name="cardName"
                              placeholder="Any Name (Dummy)"
                              value={formData.cardName}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </>
                      )}

                      {paymentMethod === "upi" && (
                        <div className="text-center py-4">
                          <div className="bg-light p-4 rounded">
                            <h6>Scan QR Code or Pay via UPI ID</h6>
                            <div className="bg-white p-3 d-inline-block rounded border">
                              <div style={{ width: '150px', height: '150px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                QR Code
                              </div>
                            </div>
                            <p className="mt-2 small text-muted">UPI ID: revtickets@upi</p>
                          </div>
                        </div>
                      )}

                      <div className="row mb-3">
                        <div className="col-6">
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            placeholder="test@example.com (Dummy)"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="col-6">
                          <label className="form-label">Phone</label>
                          <input
                            type="tel"
                            className="form-control"
                            name="phone"
                            placeholder="Any phone number (Dummy)"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => navigate("/events")}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn btn-success flex-grow-1"
                          disabled={processing}
                        >
                          {processing ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Processing...
                            </>
                          ) : (
                            `Pay $${total}`
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;