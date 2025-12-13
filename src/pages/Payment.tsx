import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/payment.css";

// Declare Razorpay on window object
declare global {
  interface Window {
    Razorpay: any;
  }
}

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { seats, total, showId, bookingType, travelId, eventId } = location.state || { seats: [], total: 0 };

  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Helper to load Razorpay script if not already loaded
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setProcessing(true);

    const res = await loadRazorpay();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setProcessing(false);
      return;
    }

    // In a real app, you would verify the amount on the backend and get an order_id
    // For this demo, we use client-side generation (Test Mode)

    const options = {
      key: "rzp_test_RrAj72tYAEHdEt", // Razorpay Test Mode Key
      amount: total * 100, // Amount in paise
      currency: "INR",
      name: "RevTickets",
      description: `Payment for ${bookingType || 'Tickets'}`,
      image: "/Gemini_Generated_Image_u3szt5u3szt5u3sz.png", // Verify this path
      handler: async function (response: any) {
        // Payment Success Handler
        console.log("Payment Successful", response);
        // Call backend to save booking
        await completeBooking(response.razorpay_payment_id);
      },
      prefill: {
        name: "RevTickets User",
        email: "user@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "RevTickets Corporate Office",
      },
      theme: {
        color: "#E11D48",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    setProcessing(false);
  };

  const completeBooking = async (paymentId: string) => {
    try {
      setProcessing(true);

      // Get user from localStorage
      const authData = localStorage.getItem('rev_auth');
      let userId = null;
      if (authData) {
        try {
          const auth = JSON.parse(authData);
          userId = auth.user?.id;
        } catch (e) {
          console.error('Failed to parse auth data:', e);
        }
      }

      if (!userId) {
        alert('Please log in to complete booking');
        navigate('/login');
        return;
      }

      const bookingPayload: any = {
        user: { id: userId },
        seats: seats,
        totalPrice: total,
        status: 'CONFIRMED',
        bookingDate: new Date().toISOString(),
        paymentId: paymentId
      };

      if (showId) {
        bookingPayload.show = { id: showId };
      } else if (travelId) {
        bookingPayload.travel = { id: travelId };
      } else if (eventId) {
        bookingPayload.event = { id: eventId };
      }

      console.log('Creating booking with payload:', bookingPayload);

      // Import locally to avoid circular dependencies or top-level failures
      const { createBooking } = await import("../utils/api");
      const newBooking = await createBooking(bookingPayload);

      console.log('Booking created successfully:', newBooking);

      setPaymentSuccess(true);
      // Navigate to success page with real details
      navigate('/payment-success', {
        state: {
          bookingType: bookingType || 'Booking',
          bookingDetails: {
            totalAmount: total,
            selectedSeats: seats,
            bookingId: newBooking.id || 'CONFIRMED', // ID from backend
            // Pass through other details if needed for success page
            ...location.state
          }
        }
      });
    } catch (error: any) {
      console.error('Booking creation error:', error);
      console.error('Error response:', error.response?.data);
      alert("Booking creation failed: " + (error.message || error));
    } finally {
      setProcessing(false);
    }
  };

  // Inline success UI removed as we redirect now.
  if (paymentSuccess) return null; // Or a loading spinner while redirecting replaces this


  return (
    <div className="payment-page">
      <div className="payment-header">
        <div className="container">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" />
            </svg>
          </button>
          <h5 className="mb-0">Payment</h5>
        </div>
      </div>

      <div className="container py-4">
        <div className="text-center py-5">
          <h3 className="mb-4 text-dark fw-bold">Review Your Booking</h3>
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

            <div className="alert alert-info mt-3 small text-start">
              <i className="bi bi-shield-lock me-1"></i>
              Secure payment via Razorpay. Supports UPI, Cards, Netbanking.
            </div>

            <button
              className="btn btn-danger w-100 mt-3"
              onClick={handlePayment}
              disabled={processing}
            >
              {processing ? "Processing..." : `Pay ₹${total} with Razorpay`}
            </button>

            <button
              className="btn btn-outline-secondary w-100 mt-2"
              onClick={() => completeBooking("DEMO_PAYMENT_" + Date.now())}
              disabled={processing}
            >
              Skip Payment (Demo Mode)
            </button>

            <p className="text-muted small mt-2 mb-0 text-center">
              Demo mode: Booking will be created without actual payment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;