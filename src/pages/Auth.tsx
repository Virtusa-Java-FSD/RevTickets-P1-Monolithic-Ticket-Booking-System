import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Auth: React.FC = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  // Login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  
  // Register states
  const [name, setName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!showOtp) {
      setShowOtp(true);
      setMessage("OTP sent to your email. Please check and enter below.");
    } else {
      if (otp.length !== 6) {
        setError("Please enter valid 6-digit OTP");
        return;
      }
      try {
        await login(email, password);
        navigate("/dashboard");
      } catch (err: any) {
        setError("Invalid OTP or login failed");
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (regPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    try {
      await register(name, regEmail, phone, regPassword);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
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

  const resetForm = () => {
    setError(null);
    setMessage(null);
    setShowOtp(false);
    setShowForgotPassword(false);
    setOtp("");
  };

  const switchTab = (loginMode: boolean) => {
    setIsLogin(loginMode);
    resetForm();
  };

  if (showForgotPassword) {
    return (
      <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 p-4">
        <div className="w-100" style={{ maxWidth: "420px" }}>
          <div className="card border-0 shadow" style={{ margin: "20px 0", borderRadius: "12px" }}>
            <div className="card-body p-4">
              <h4 className="text-center mb-4">Reset Password</h4>
              <form onSubmit={handleForgotPassword}>
                <div className="mb-3">
                  <input
                    className="form-control"
                    type="email"
                    placeholder="Enter your email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>
                {error && <div className="alert alert-danger py-2 small">{error}</div>}
                {message && <div className="alert alert-success py-2 small">{message}</div>}
                <button className="btn btn-primary w-100 mb-3" type="submit">
                  Send Reset Link
                </button>
              </form>
              <div className="text-center">
                <small>
                  <a href="#" onClick={() => setShowForgotPassword(false)}>Back to Login</a>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 p-4">
      <div className="w-100" style={{ maxWidth: "420px" }}>
        <div className="card border-0 shadow" style={{ margin: "20px 0", borderRadius: "12px" }}>
          {/* Tab Headers */}
          <div className="card-header bg-white border-0 p-0" style={{ borderRadius: "12px 12px 0 0" }}>
            <div className="row g-0">
              <div className="col-6">
                <button
                  className={`btn w-100 py-3 ${isLogin ? 'btn-primary' : 'btn-outline-secondary'}`}
                  style={{ borderRadius: "12px 0 0 0", border: "none" }}
                  onClick={() => switchTab(true)}
                >
                  Sign In
                </button>
              </div>
              <div className="col-6">
                <button
                  className={`btn w-100 py-3 ${!isLogin ? 'btn-primary' : 'btn-outline-secondary'}`}
                  style={{ borderRadius: "0 12px 0 0", border: "none" }}
                  onClick={() => switchTab(false)}
                >
                  Create Account
                </button>
              </div>
            </div>
          </div>

          <div className="card-body p-4">
            {isLogin ? (
              // Login Form
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <input
                    className="form-control"
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={showOtp}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    className="form-control"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={showOtp}
                    required
                  />
                </div>
                {showOtp && (
                  <div className="mb-3">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                      required
                    />
                  </div>
                )}
                {error && <div className="alert alert-danger py-2 small">{error}</div>}
                {message && <div className="alert alert-info py-2 small">{message}</div>}
                <button className="btn btn-primary w-100 mb-3" type="submit">
                  {showOtp ? 'Verify OTP' : 'Send OTP'}
                </button>
                <div className="text-center">
                  <small>
                    <a href="#" onClick={() => setShowForgotPassword(true)}>Forgot Password?</a>
                  </small>
                </div>
              </form>
            ) : (
              // Register Form
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <input
                    className="form-control"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    className="form-control"
                    type="email"
                    placeholder="Email Address"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    className="form-control"
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    className="form-control"
                    type="password"
                    placeholder="Password (min 6 chars)"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    minLength={6}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    className="form-control"
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength={6}
                    required
                  />
                </div>
                {error && <div className="alert alert-danger py-2 small">{error}</div>}
                <button className="btn btn-primary w-100 mb-3" type="submit">
                  Create Account
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;