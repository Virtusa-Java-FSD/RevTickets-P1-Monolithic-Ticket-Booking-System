import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MovieIcon, EventIcon, ConcertIcon, TravelIcon } from "../assets/icons";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const isHomePage = location.pathname === '/';

  const closeNavbar = () => {
    const navbarToggler = document.querySelector('.navbar-toggler') as HTMLElement;
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse?.classList.contains('show') && navbarToggler) {
      navbarToggler.click();
    }
    setMenuOpen(false);
  };

  useEffect(() => {
    if (!isHomePage) return;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 800) {
        setIsVisible(currentScrollY < lastScrollY);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isHomePage]);

  useEffect(() => {
    const handleGlobalClick = (e: Event) => {
      const navbar = document.querySelector('.navbar');
      
      if (menuOpen && navbar && !navbar.contains(e.target as Node)) {
        setMenuOpen(false);
        closeNavbar();
      }
    };

    document.addEventListener('click', handleGlobalClick);
    document.addEventListener('touchstart', handleGlobalClick);
    
    return () => {
      document.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('touchstart', handleGlobalClick);
    };
  }, [menuOpen]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{
      background: '#1f1f1f',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
    }}>
      <div className="container-fluid px-3">
        <Link className="navbar-brand fw-bold" to="/" style={{ color: '#ef4444', fontSize: '1.5rem' }}>
          RevTickets
        </Link>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center gap-1 py-2" to="/movies" onClick={closeNavbar} style={{ color: '#fff' }}>
                <MovieIcon size={18} />
                <span>Movies</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center gap-1 py-2" to="/events" onClick={closeNavbar} style={{ color: '#fff' }}>
                <EventIcon size={18} />
                <span>Events</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center gap-1 py-2" to="/concerts" onClick={closeNavbar} style={{ color: '#fff' }}>
                <ConcertIcon size={18} />
                <span>Concerts</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center gap-1 py-2" to="/travels" onClick={closeNavbar} style={{ color: '#fff' }}>
                <TravelIcon size={18} />
                <span>Travels</span>
              </Link>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto">
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard" onClick={closeNavbar} style={{ color: '#fff' }}>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={() => { logout(); closeNavbar(); }} style={{ color: '#fff' }}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={closeNavbar} style={{ color: '#fff' }}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-danger btn-sm" onClick={() => { closeNavbar(); }} style={{ borderRadius: '6px' }}>
                    <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Sign Up</Link>
                  </button>
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
