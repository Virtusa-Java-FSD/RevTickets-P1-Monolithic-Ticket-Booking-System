import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{ maxWidth: "500px", width: "100%" }}>
      <div className="card shadow">
        <div className="card-body p-5">
          <h2 className="card-title text-center mb-4">Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button className="btn btn-primary w-100" type="submit">
              Register
            </button>
          </form>
          <p className="text-center mt-3" style={{ fontSize: "0.9rem" }}>
            Already have an account? <a href="/login" style={{ fontWeight: "500" }}>Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

