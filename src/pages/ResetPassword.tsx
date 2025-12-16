import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../services/authService";
import "../styles/auth.css";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError("Invalid reset link");
        setIsValidToken(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await authService.validateResetToken(token);
        setIsValidToken(response.valid);
        if (!response.valid) {
          setError("This reset link has expired or is invalid");
        }
      } catch (err: any) {
        setError("Invalid reset link");
        setIsValidToken(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await authService.resetPassword(token!, newPassword);
      setMessage(response.message);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to reset password. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="auth-layout">
        <div className="auth-content">
          <div className="typewriter-text-large mb-2">RevTickets</div>
          <p>Loading...</p>
        </div>
        <div className="auth-form">
          <div className="auth-card">
            <div className="card-body p-4 text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Validating reset link...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="auth-layout">
        <div className="auth-content">
          <div className="typewriter-text-large mb-2">RevTickets</div>
          <p>Password Reset</p>
        </div>
        <div className="auth-form">
          <div className="auth-card">
            <div className="card-body p-4 text-center">
              <h4 className="auth-title text-center mb-4 text-danger">Invalid Link</h4>
              <p className="text-muted mb-4">{error}</p>
              <button 
                className="auth-btn btn w-100 mb-3" 
                onClick={() => navigate("/login")}
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-layout">
      <div className="auth-content">
        <div className="typewriter-text-large mb-2">RevTickets</div>
        <p>Reset Your Password</p>
        <div className="features">
          <div>🔒 Secure</div>
          <div>🔑 New Password</div>
          <div>✅ Protected</div>
          <div>🚀 Quick</div>
        </div>
      </div>
      <div className="auth-form">
        <div className="auth-card">
          <div className="card-body p-4">
            <h4 className="auth-title text-center mb-4">Create New Password</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  className="auth-input form-control"
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <small className="text-muted">Password must be at least 6 characters</small>
              </div>
              <div className="mb-3">
                <input
                  className="auth-input form-control"
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              {error && <div className="alert alert-danger auth-alert py-2 small">{error}</div>}
              {message && <div className="alert alert-success auth-alert py-2 small">{message}</div>}
              <button className="auth-btn btn w-100 mb-3" type="submit">
                Reset Password
              </button>
            </form>
            <div className="text-center">
              <small>
                <a href="/login" className="auth-link">Back to Login</a>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;