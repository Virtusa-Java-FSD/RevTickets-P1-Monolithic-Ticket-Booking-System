import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isAdmin } from "../context/AuthContext";
import { HomeIcon, MovieIcon, EventIcon, ConcertIcon, TravelIcon } from "../assets/icons";

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        // On desktop, keep sidebar in collapsed state when switching from mobile
      } else {
        // On mobile, close sidebar when switching from desktop
        setIsSidebarOpen(false);
      }
    };
    
    checkResize(); // Initial check
    window.addEventListener('resize', checkResize);
    return () => window.removeEventListener('resize', checkResize);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const userProfile = document.querySelector('.header-user-profile');
      if (userProfile && !userProfile.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector('.sidebar-container');
      const hamburger = document.querySelector('.hamburger-btn');
      const target = event.target as Node;
      
      if (isSidebarOpen && sidebar && hamburger) {
        // Don't close if clicking inside sidebar or on hamburger button
        if (!sidebar.contains(target) && !hamburger.contains(target)) {
          setIsSidebarOpen(false);
        }
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  // Handle main content shifting
  useEffect(() => {
    const mainContent = document.querySelector('.app-main');
    const body = document.body;
    
    if (mainContent && body) {
      if (isSidebarOpen) {
        mainContent.classList.add('sidebar-open');
        body.classList.add('sidebar-open');
      } else {
        mainContent.classList.remove('sidebar-open');
        body.classList.remove('sidebar-open');
      }
    }
  }, [isSidebarOpen]);

  const handleToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setShowUserMenu(false);
  };

  const navigationItems = [
    { path: "/", label: "Home", icon: HomeIcon },
    { path: "/movies", label: "Movies", icon: MovieIcon },
    { path: "/events", label: "Events", icon: EventIcon },
    { path: "/concerts", label: "Concerts", icon: ConcertIcon },
    { path: "/travels", label: "Travel", icon: TravelIcon },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <div className="top-header">
        <div className="header-left">
          <button 
            className="hamburger-btn"
            onClick={handleToggle}
            aria-label="Toggle sidebar"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <Link to="/" className="header-logo">
            <span className="logo-text">RevTickets</span>
          </Link>
        </div>
        
        <div className="header-right">
          {user ? (
            <div className="header-user-profile">
              <div 
                className="header-user-info"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="header-user-avatar">
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="header-user-details">
                  <div className="header-user-name">{user.name || user.email}</div>
                </div>
                <span className="header-dropdown-arrow">⌄</span>
              </div>
              {showUserMenu && (
                <div className="header-user-menu">
                  <Link to="/dashboard" className="header-user-menu-item" onClick={() => setShowUserMenu(false)}>
                    Dashboard
                  </Link>
                  {isAdmin(user) && (
                    <Link to="/admin/dashboard" className="header-user-menu-item" onClick={() => setShowUserMenu(false)}>
                      Admin Dashboard
                    </Link>
                  )}
                  <button onClick={() => { logout(); setShowUserMenu(false); }} className="header-user-menu-item header-logout-btn">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="header-auth-buttons">
              <Link to="/login" className="header-auth-btn">Login</Link>
              <Link to="/register" className="header-auth-btn">Register</Link>
            </div>
          )}
        </div>
      </div>
      
      <div className={`sidebar-container ${isSidebarOpen ? 'open' : ''}`}>

        <nav className="sidebar-nav">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-nav-item ${isActive(item.path) ? "active" : ""}`}
              onClick={() => {}}
            >
              <span className="nav-icon">
                <item.icon size={20} />
              </span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>


      </div>
      {isSidebarOpen && isMobile && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
    </>
  );
};

export default Sidebar;