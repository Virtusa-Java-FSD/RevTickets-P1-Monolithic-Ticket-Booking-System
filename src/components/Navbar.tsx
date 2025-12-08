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
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isFixed, setIsFixed] = useState(false);
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
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (isHomePage) {
        // Home page: Make navbar fixed when scrolling starts
        if (currentScrollY > 50 && !isFixed) {
          setIsFixed(true);
        } else if (currentScrollY <= 50 && isFixed) {
          setIsFixed(false);
          setIsVisible(true);
        }
        
        // Only apply scroll behavior when navbar is fixed
        if (isFixed) {
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down - show navbar for 2 seconds then hide
            setIsVisible(true);
            
            // Clear existing timeout
            if (hideTimeout) {
              clearTimeout(hideTimeout);
            }
            
            // Set new timeout to hide navbar after 2 seconds
            const timeout = setTimeout(() => {
              setIsVisible(false);
            }, 2000);
            
            setHideTimeout(timeout);
          } else if (currentScrollY < lastScrollY) {
            // Scrolling up - show navbar and keep it visible
            setIsVisible(true);
            
            // Clear hide timeout so navbar stays visible
            if (hideTimeout) {
              clearTimeout(hideTimeout);
              setHideTimeout(null);
            }
          }
        }
      } else {
        // Other pages: Simple hide/show behavior
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY) {
          setIsVisible(true);
        }
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [lastScrollY, hideTimeout, isFixed, isHomePage]);

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
    <nav className={`navbar navbar-expand-lg navbar-dark intensive-navbar ${isHomePage && isFixed ? 'fixed-top' : ''}`} style={{
      background: '#ffffff',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      borderBottom: '1px solid #e0e0e0',
      transform: (isHomePage && isFixed && !isVisible) || (!isHomePage && !isVisible) ? 'translateY(-100%)' : 'translateY(0)',
      transition: 'transform 0.3s ease-in-out',
      height: '60px',
      minHeight: '60px'
    }}>
      <div className="container-fluid" style={{ padding: '0 24px', height: '100%' }}>
        <div className="d-flex align-items-center justify-content-between w-100" style={{ height: '100%' }}>
          {/* Logo Section */}
          <Link className="navbar-brand d-flex align-items-center" to="/" style={{ 
            color: '#222', 
            fontWeight: '700',
            fontSize: '1.5rem',
            margin: '0',
            padding: '0'
          }}>
            RevTickets
          </Link>

          {/* Mobile Toggle */}
          <button 
            className="navbar-toggler d-lg-none" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ border: 'none', padding: '4px 8px' }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Desktop Navigation */}
          <div className="d-none d-lg-flex align-items-center" style={{ height: '100%' }}>
            {/* Main Navigation Links */}
            <div className="d-flex align-items-center" style={{ marginLeft: '48px' }}>
              <Link className="nav-link-intensive" to="/movies" onClick={closeNavbar}>
                <MovieIcon size={16} />
                <span>Movies</span>
              </Link>
              <Link className="nav-link-intensive" to="/events" onClick={closeNavbar}>
                <EventIcon size={16} />
                <span>Events</span>
              </Link>
              <Link className="nav-link-intensive" to="/concerts" onClick={closeNavbar}>
                <ConcertIcon size={16} />
                <span>Concerts</span>
              </Link>
              <Link className="nav-link-intensive" to="/travels" onClick={closeNavbar}>
                <TravelIcon size={16} />
                <span>Travels</span>
              </Link>
            </div>

            {/* Right Side Navigation */}
            <div className="d-flex align-items-center" style={{ marginLeft: 'auto' }}>
              {user ? (
                <>
                  <Link className="nav-link-intensive" to="/dashboard" onClick={closeNavbar}>
                    Dashboard
                  </Link>
                  <button className="nav-link-intensive btn-link-intensive" onClick={() => { logout(); closeNavbar(); }}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link className="nav-link-intensive" to="/login" onClick={closeNavbar}>
                    Login
                  </Link>
                  <Link className="nav-link-intensive" to="/register" onClick={closeNavbar}>
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="collapse navbar-collapse d-lg-none" id="navbarNav">
            <ul className="navbar-nav w-100">
              <li className="nav-item">
                <Link className="nav-link d-flex align-items-center gap-2 py-2" to="/movies" onClick={closeNavbar}>
                  <MovieIcon size={18} />
                  <span>Movies</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link d-flex align-items-center gap-2 py-2" to="/events" onClick={closeNavbar}>
                  <EventIcon size={18} />
                  <span>Events</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link d-flex align-items-center gap-2 py-2" to="/concerts" onClick={closeNavbar}>
                  <ConcertIcon size={18} />
                  <span>Concerts</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link d-flex align-items-center gap-2 py-2" to="/travels" onClick={closeNavbar}>
                  <TravelIcon size={18} />
                  <span>Travels</span>
                </Link>
              </li>
              <hr className="my-2" />
              {user ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link py-2" to="/dashboard" onClick={closeNavbar}>
                      Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-link nav-link py-2" onClick={() => { logout(); closeNavbar(); }}>
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link py-2" to="/login" onClick={closeNavbar}>
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link py-2" to="/register" onClick={closeNavbar}>
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
