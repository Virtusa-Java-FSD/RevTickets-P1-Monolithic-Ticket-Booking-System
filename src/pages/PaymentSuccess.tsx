import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface TransactionData {
  transactionId: string;
  eventTitle: string;
  tickets: number;
  amount: number;
  paymentMethod: string;
  status: string;
  timestamp: string;
  email: string;
  phone: string;
}

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null);

  useEffect(() => {
    if (location.state?.transactionData) {
      setTransactionData(location.state.transactionData);
    } else {
      navigate("/events");
    }
  }, [location.state, navigate]);

  const downloadTicket = () => {
    // Create a simple text ticket
    const ticketContent = `
=================================
       REVTICKETS E-TICKET
=================================

Event: ${transactionData?.eventTitle}
Tickets: ${transactionData?.tickets}
Amount Paid: $${transactionData?.amount}
Transaction ID: ${transactionData?.transactionId}
Payment Method: ${transactionData?.paymentMethod}
Date: ${new Date(transactionData?.timestamp || '').toLocaleString()}

Contact: ${transactionData?.email}
Phone: ${transactionData?.phone}

=================================
    Thank you for booking!
=================================
    `;

    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${transactionData?.transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (!transactionData) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-success-page bg-light min-vh-100">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center p-5">
                {/* Success Icon */}
                <div className="mb-4">
                  <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center" 
                       style={{ width: '80px', height: '80px' }}>
                    <span style={{ fontSize: '2.5rem' }}>✅</span>
                  </div>
                </div>

                {/* Success Message */}
                <h2 className="text-success mb-3">Payment Successful!</h2>
                <p className="text-muted mb-4">
                  Your booking has been confirmed. You will receive a confirmation email shortly.
                </p>

                {/* Transaction Details */}
                <div className="bg-light p-4 rounded mb-4 text-start">
                  <h5 className="mb-3">Booking Details</h5>
                  <div className="row g-2">
                    <div className="col-6"><strong>Event:</strong></div>
                    <div className="col-6">{transactionData.eventTitle}</div>
                    
                    <div className="col-6"><strong>Tickets:</strong></div>
                    <div className="col-6">{transactionData.tickets}</div>
                    
                    <div className="col-6"><strong>Amount:</strong></div>
                    <div className="col-6">${transactionData.amount}</div>
                    
                    <div className="col-6"><strong>Transaction ID:</strong></div>
                    <div className="col-6 small text-primary">{transactionData.transactionId}</div>
                    
                    <div className="col-6"><strong>Payment Method:</strong></div>
                    <div className="col-6">{transactionData.paymentMethod === 'card' ? '💳 Credit Card' : '📱 UPI'}</div>
                    
                    <div className="col-6"><strong>Date & Time:</strong></div>
                    <div className="col-6 small">{new Date(transactionData.timestamp).toLocaleString()}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                  <button 
                    className="btn btn-primary"
                    onClick={downloadTicket}
                  >
                    📄 Download Ticket
                  </button>
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => navigate('/events')}
                  >
                    🎪 Browse More Events
                  </button>
                </div>

                {/* Additional Info */}
                <div className="mt-4 pt-4 border-top">
                  <p className="small text-muted mb-2">
                    📧 Confirmation sent to: <strong>{transactionData.email}</strong>
                  </p>
                  <p className="small text-muted mb-0">
                    📱 SMS sent to: <strong>{transactionData.phone}</strong>
                  </p>
                </div>

                {/* Dummy Transaction Notice */}
                <div className="alert alert-info mt-4" role="alert">
                  <small>
                    <strong>Note:</strong> This is a dummy transaction for demonstration purposes. 
                    No real money has been charged.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;