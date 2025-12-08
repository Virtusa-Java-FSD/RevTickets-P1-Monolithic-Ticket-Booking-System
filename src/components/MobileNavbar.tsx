import React from "react";

interface MobileNavbarProps {
  onToggleSidebar: () => void;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({ onToggleSidebar }) => {
  return (
    <nav className="navbar d-lg-none">
      <div className="container-fluid">
        <span className="navbar-brand">RevTickets</span>
        <button 
          className="navbar-toggler"
          type="button"
          onClick={onToggleSidebar}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
      </div>
    </nav>
  );
};

export default MobileNavbar;