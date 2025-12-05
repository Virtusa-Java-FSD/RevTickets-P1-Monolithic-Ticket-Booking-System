import React from 'react';
import { Link } from 'react-router-dom';
import { MovieIcon, EventIcon, ConcertIcon, TravelIcon } from '../assets/icons';

const Home = () => {
  const categories = [
    {
      title: 'Movies',
      description: 'Book tickets for the latest blockbusters',
      icon: <MovieIcon size={56} />,
      path: '/movies',
      gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
      shadow: 'rgba(255, 107, 107, 0.4)'
    },
    {
      title: 'Events',
      description: 'Discover amazing events near you',
      icon: <EventIcon size={56} />,
      path: '/events',
      gradient: 'linear-gradient(135deg, #4834d4 0%, #686de0 100%)',
      shadow: 'rgba(72, 52, 212, 0.4)'
    },
    {
      title: 'Concerts',
      description: 'Live music and unforgettable performances',
      icon: <ConcertIcon size={56} />,
      path: '/concerts',
      gradient: 'linear-gradient(135deg, #ff9ff3 0%, #f368e0 100%)',
      shadow: 'rgba(243, 104, 224, 0.4)'
    },
    {
      title: 'Travels',
      description: 'Plan your perfect getaway',
      icon: <TravelIcon size={56} />,
      path: '/travels',
      gradient: 'linear-gradient(135deg, #7bed9f 0%, #2ed573 100%)',
      shadow: 'rgba(46, 213, 115, 0.4)'
    }
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        <div className="container text-center">
          <div className="hero-content">
            <div className="hero-logo-section">
              <div className="logo-container">
                <div className="logo-circle">RT</div>
                <div className="logo-glow"></div>
              </div>
              <div className="brand-text">
                <h1 className="hero-title">RevTickets</h1>
                <span className="brand-tagline">Monolithic Booking System</span>
              </div>
            </div>
            <p className="hero-subtitle">Your gateway to unforgettable experiences</p>
          </div>
        </div>
      </div>

      {/* Category Cards */}
      <div className="container categories-section">
        <h2 className="section-title">What are you looking for?</h2>
        <div className="row g-2 g-sm-3 g-md-4">
          {categories.map((category, index) => (
            <div key={index} className="col-6 col-sm-6 col-md-6 col-lg-3">
              <Link to={category.path} className="text-decoration-none">
                <div className="category-card" style={{'--card-gradient': category.gradient, '--card-shadow': category.shadow}}>
                  <div className="card-glow"></div>
                  <div className="category-icon">
                    {category.icon}
                  </div>
                  <h3 className="category-title">{category.title}</h3>
                  <p className="category-description">{category.description}</p>
                  <div className="card-shine"></div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;