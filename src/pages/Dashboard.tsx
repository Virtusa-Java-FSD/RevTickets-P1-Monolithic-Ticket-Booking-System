import React from "react";
import { useAuth } from "../context/AuthContext";

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mt-4">
      <h2>Dashboard</h2>
      <p>Welcome {user?.name || user?.email || "User"}.</p>

      <div className="row">
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Bookings</h5>
              <p className="card-text">Your recent bookings will appear here.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Profile</h5>
              <p className="card-text">Manage your profile and payment methods.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
