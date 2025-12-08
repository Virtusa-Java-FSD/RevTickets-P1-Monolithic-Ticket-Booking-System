import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MovieIcon, EventIcon, ConcertIcon, TravelIcon } from "../assets/icons";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{
      background: '#ffffff',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      borderBottom: '1px solid #e0e0e0'
    }}>
      <div className="container-fluid px-2">
        <Link className="navbar-brand" to="/" style={{ color: '#222' }}>
          RevTickets
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center gap-1 py-2" to="/movies">
                <MovieIcon size={18} />
                <span>Movies</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center gap-1 py-2" to="/events">
                <EventIcon size={18} />
                <span>Events</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center gap-1 py-2" to="/concerts">
                <ConcertIcon size={18} />
                <span>Concerts</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center gap-1 py-2" to="/travels">
                <TravelIcon size={18} />
                <span>Travels</span>
              </Link>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto">
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={logout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
