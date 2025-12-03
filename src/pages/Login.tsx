import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: "500px", width: "100%" }}>
      <div className="card shadow">
        <div className="card-body p-5">
          <h2 className="card-title text-center mb-4">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button className="btn btn-primary w-100" type="submit">
              Login
            </button>
          </form>
          <p className="text-center mt-3" style={{ fontSize: "0.9rem" }}>
            Don't have an account? <a href="/register" style={{ fontWeight: "500" }}>Register here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
