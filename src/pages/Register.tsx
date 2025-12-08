import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { sendOTP, verifyOTP } from "../utils/api";
import "../styles/auth.css";

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    const text = "Welcome to RevTickets";
    let index = 0;
    const timer = setInterval(() => {
      setDisplayText(text.slice(0, index + 1));
      index++;
      if (index >= text.length) {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    
    if (!showOtp) {
      // Step 1: Send OTP
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      
      try {
        await sendOTP({ email });
        setShowOtp(true);
        setMessage("OTP sent to your email. Please check and enter the 6-digit code.");
      } catch (err: any) {
        setError(err.message || "Failed to send OTP");
      }
    } else {
      // Step 2: Verify OTP and Register
      if (otp.length !== 6) {
        setError("Please enter valid 6-digit OTP");
        return;
      }
      
      try {
        // First verify OTP
        const otpResponse = await verifyOTP({ email, otp });
        
        // Check if OTP verification was successful
        if (otpResponse.verified === true) {
          // If OTP is verified, proceed with registration
          await register(name, email, phone, password);
          setMessage("Registration successful! Redirecting...");
          setTimeout(() => navigate("/"), 1500);
        } else {
          setError("OTP verification failed. Please try again.");
        }
      } catch (err: any) {
        setError(err.message || "Registration failed");
      }
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-content">
        <div className="typewriter-text-large mb-2">{displayText}</div>
        <p>Your Gateway to Entertainment</p>
        <div className="features">
          <div>🎬 Movies</div>
          <div>🎵 Concerts</div>
          <div>🎪 Events</div>
          <div>✈️ Travel</div>
        </div>
      </div>
      <div className="auth-form">
        <div className="auth-card">
          <div className="card-body p-4">
            <h4 className="auth-title text-center mb-4">Create Account</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input 
                  className="auth-input form-control" 
                  placeholder="Full Name"
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>
              <div className="mb-3">
                <input 
                  className="auth-input form-control" 
                  type="email" 
                  placeholder="Email Address"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <div className="mb-3">
                <input 
                  className="auth-input form-control" 
                  type="tel" 
                  placeholder="Phone Number"
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  required 
                />
              </div>
              <div className="mb-3">
                <input 
                  className="auth-input form-control" 
                  type="password" 
                  placeholder="Password (min 6 chars)"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  minLength={6}
                  required 
                />
              </div>
              <div className="mb-3">
                <input 
                  className="auth-input form-control" 
                  type="password" 
                  placeholder="Confirm Password"
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  minLength={6}
                  required 
                />
              </div>
              {showOtp && (
                <div className="mb-3">
                  <input 
                    className="auth-input form-control" 
                    type="text" 
                    placeholder="Enter 6-digit OTP"
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} 
                    maxLength={6}
                    required 
                  />
                </div>
              )}
              {error && <div className="alert alert-danger auth-alert py-2 small">{error}</div>}
              {message && <div className="alert alert-info auth-alert py-2 small">{message}</div>}
              <button className="auth-btn btn w-100 mb-3" type="submit">
                {showOtp ? 'Verify OTP & Register' : 'Send OTP'}
              </button>
            </form>
            <div className="text-center">
              <small>Already have account? <a href="/login" className="auth-link">Sign In</a></small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

