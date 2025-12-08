import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [typingText, setTypingText] = useState("");

  useEffect(() => {
    const text = "Gateway to Entertainment";
    let index = 0;
    const timer = setInterval(() => {
      setTypingText(text.slice(0, index + 1));
      index++;
      if (index >= text.length) {
        clearInterval(timer);
      }
    }, 80);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await login(emailOrPhone, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage("Password reset link sent to your email!");
    setTimeout(() => {
      setShowForgotPassword(false);
      setMessage(null);
    }, 2000);
  };

  if (showForgotPassword) {
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
              <h4 className="auth-title text-center mb-4">Reset Password</h4>
              <form onSubmit={handleForgotPassword}>
                <div className="mb-3">
                  <input
                    className="auth-input form-control"
                    type="email"
                    placeholder="Enter your email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>
                {error && <div className="alert alert-danger auth-alert py-2 small">{error}</div>}
                {message && <div className="alert alert-success auth-alert py-2 small">{message}</div>}
                <button className="auth-btn btn w-100 mb-3" type="submit">
                  Send Reset Link
                </button>
              </form>
              <div className="text-center">
                <small>
                  <a href="#" className="auth-link" onClick={() => setShowForgotPassword(false)}>Back to Login</a>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-layout">
      <div className="auth-content">
        <div className="typewriter-text-large mb-2">Welcome to RevTickets</div>
        <p>{typingText}</p>
        <div className="features">
          <div>Movies</div>
          <div>Concerts</div>
          <div>Events</div>
          <div>Travel</div>
        </div>
      </div>
      <div className="auth-form">
        <div className="auth-card">
          <div className="card-body p-4">
            <h4 className="auth-title text-center mb-4">Sign In</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  className="auth-input form-control"
                  type="text"
                  placeholder="Email or Phone Number"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  className="auth-input form-control"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <div className="alert alert-danger auth-alert py-2 small">{error}</div>}
              {message && <div className="alert alert-info auth-alert py-2 small">{message}</div>}
              <button className="auth-btn btn w-100 mb-3" type="submit">
                Sign In
              </button>
            </form>
            <div className="text-center">
              <small>
                <a href="#" className="auth-link" onClick={() => setShowForgotPassword(true)}>Forgot Password?</a>
              </small>
              <br />
              <small>New user? <a href="/register" className="auth-link">Create Account</a></small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;