import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from "../components/Footer";
import { MovieIcon, EventIcon, ConcertIcon, TravelIcon } from '../assets/icons';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('Movies');

  const sliderImages = [
    {
      url: 'https://images.unsplash.com/photo-1489599904472-84978f312f2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      title: 'Latest Movies',
      subtitle: 'Experience cinema like never before'
    },
    {
      url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      title: 'Live Events',
      subtitle: 'Unforgettable moments await you'
    },
    {
      url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      title: 'Live Concerts',
      subtitle: 'Feel the rhythm, live the music'
    },
    {
      url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      title: 'Travel Adventures',
      subtitle: 'Discover new destinations'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [sliderImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

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

      <div className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-overlay"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        <div className="container text-center">
          <div className="hero-content">
            <div className="hero-logo-section">
              <div className="logo-container">
                <Link to="/" className="text-decoration-none">
                  <div className="logo-circle">RT</div>
                  <div className="logo-glow"></div>
                </Link>
              </div>
              <div className="brand-text">
                <h1 className="hero-title">RevTickets</h1>
                <span className="brand-tagline">Monolithic Booking System</span>
              </div>
            </div>
            <p className="hero-subtitle">Your gateway to unforgettable experiences</p>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Events</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Happy Users</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100+</div>
                <div className="stat-label">Cities</div>
              </div>
            </div>
            <div className="hero-cta">
              <button 
                onClick={() => document.querySelector('.categories-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="cta-btn cta-primary"
              >
                <span>🚀</span> Explore More
              </button>
            </div>
          </div>
        </div>
      </div>


      <div className="slider-section">
        <div className="image-slider">
          <div className="slider-container">
            {sliderImages.map((slide, index) => (
              <div
                key={index}
                className={`slide ${index === currentSlide ? 'active' : ''}`}
                style={{ backgroundImage: `url(${slide.url})` }}
              >
                <div className="slide-overlay"></div>
                <div className="slide-content">
                  <h3 className="slide-title">{slide.title}</h3>
                  <p className="slide-subtitle">{slide.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button className="slider-btn prev-btn" onClick={prevSlide}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <button className="slider-btn next-btn" onClick={nextSlide}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <div className="slider-dots">
            {sliderImages.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              ></button>
            ))}
          </div>
        </div>
      </div>


      <div className="search-section">
        <div className="container">
          <div className="search-container">
            <div className="search-box">
              <svg className="search-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <input type="text" placeholder="Search for movies, events, concerts, travels..." className="search-input" />
            </div>
          </div>
        </div>
      </div>


      <div className="trending-section">
        <div className="container">
          <h2 className="section-title">🔥 Trending Now</h2>
          <div className="trending-tabs">
            <button 
              className={`trending-tab ${activeTab === 'Movies' ? 'active' : ''}`}
              onClick={() => setActiveTab('Movies')}
            >
              Movies
            </button>
            <button 
              className={`trending-tab ${activeTab === 'Concerts' ? 'active' : ''}`}
              onClick={() => setActiveTab('Concerts')}
            >
              Concerts
            </button>
            <button 
              className={`trending-tab ${activeTab === 'Events' ? 'active' : ''}`}
              onClick={() => setActiveTab('Events')}
            >
              Events
            </button>
          </div>
          <div className="trending-scroll">
            {(() => {
              const movieImages = [
                'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
              ];
              const concertImages = [
                'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                'https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
              ];
              const eventImages = [
                'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                'https://images.unsplash.com/photo-1505236858219-8359eb29e329?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                'https://images.unsplash.com/photo-1464207687429-7505649dae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
              ];
              
              const images = activeTab === 'Movies' ? movieImages : activeTab === 'Concerts' ? concertImages : eventImages;
              const titles = activeTab === 'Movies' ? 
                ['Avengers: Endgame', 'The Dark Knight', 'Inception', 'Interstellar', 'Spider-Man', 'Black Panther'] :
                activeTab === 'Concerts' ? 
                ['Rock Festival', 'Jazz Night', 'Pop Concert', 'Classical Evening', 'EDM Party', 'Indie Showcase'] :
                ['Tech Conference', 'Art Exhibition', 'Food Festival', 'Sports Event', 'Comedy Show', 'Fashion Week'];
              
              return images.map((img, i) => (
                <div key={i} className="trending-card">
                  <div className="trending-image" style={{backgroundImage: `url(${img})`}}></div>
                  <div className="trending-info">
                    <h4>{titles[i]}</h4>
                    <p>⭐ 4.{8+i}/5</p>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>


      <div className="recommended-section">
        <div className="container">
          <h2 className="section-title">⭐ Recommended For You</h2>
          <div className="recommended-grid">
            {(() => {
              const recommendedItems = [
                {
                  image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                  title: 'Top Gun: Maverick',
                  description: 'Action-packed blockbuster',
                  match: '98%'
                },
                {
                  image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                  title: 'Summer Music Festival',
                  description: 'Live music experience',
                  match: '95%'
                },
                {
                  image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                  title: 'Marvel Studios',
                  description: 'Superhero adventure',
                  match: '92%'
                },
                {
                  image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                  title: 'Rock Concert',
                  description: 'Electric performance',
                  match: '90%'
                }
              ];
              
              return recommendedItems.map((item, i) => (
                <div key={i} className="recommended-card">
                  <div className="recommended-image" style={{backgroundImage: `url(${item.image})`}}></div>
                  <div className="recommended-content">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                    <span className="recommended-badge">{item.match} Match</span>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>


      <div className="upcoming-section">
        <div className="container">
          <h2 className="section-title">🎬 Upcoming Releases</h2>
          <div className="upcoming-scroll">
            {(() => {
              const upcomingItems = [
                { image: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', title: 'Avatar 3' },
                { image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', title: 'Fast X' },
                { image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', title: 'Guardians 3' },
                { image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', title: 'Coachella 2024' },
                { image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', title: 'Tomorrowland' },
                { image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', title: 'John Wick 5' },
                { image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', title: 'Lollapalooza' }
              ];
              
              return upcomingItems.map((item, i) => (
                <div key={i} className="upcoming-card">
                  <div className="upcoming-poster" style={{backgroundImage: `url(${item.image})`}}></div>
                  <h4>{item.title}</h4>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>


      <div className="toppicks-section">
        <div className="container">
          <h2 className="section-title">🏆 Top Picks This Week</h2>
          <div className="toppicks-grid">
            {(() => {
              const topPicks = [
                {
                  image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                  title: 'Spider-Man: No Way Home',
                  bookings: 2500
                },
                {
                  image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                  title: 'Coldplay World Tour',
                  bookings: 1800
                },
                {
                  image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                  title: 'Dune: Part Two',
                  bookings: 1500
                }
              ];
              
              return topPicks.map((item, i) => (
                <div key={i} className="toppicks-card">
                  <div className="toppicks-rank">#{i + 1}</div>
                  <div className="toppicks-image" style={{backgroundImage: `url(${item.image})`}}></div>
                  <div className="toppicks-info">
                    <h4>{item.title}</h4>
                    <p>🎫 {item.bookings} bookings</p>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>


      <div className="offers-section">
        <div className="container">
          <h2 className="section-title">🎁 Special Offers & Deals</h2>
          <div className="offers-grid">
            <div className="offer-card movie-offer">
              <div className="offer-icon">🎫</div>
              <h4>Movie Coupons</h4>
              <p>Up to 50% OFF</p>
              <span className="offer-code">MOVIE50</span>
            </div>
            <div className="offer-card travel-offer">
              <div className="offer-icon">✈️</div>
              <h4>Travel Discounts</h4>
              <p>Save 30% on trips</p>
              <span className="offer-code">TRAVEL30</span>
            </div>
            <div className="offer-card concert-offer">
              <div className="offer-icon">🎵</div>
              <h4>Concert Passes</h4>
              <p>Buy 2 Get 1 Free</p>
              <span className="offer-code">MUSIC21</span>
            </div>
          </div>
        </div>
      </div>

      <div className="categories-section">
        <div className="container">
          <h2 className="section-title">What are you looking for?</h2>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <Link key={index} to={category.path} className="text-decoration-none">
                <div className="category-card" style={{'--card-gradient': category.gradient, '--card-shadow': category.shadow} as React.CSSProperties}>
                  <div className="card-glow"></div>
                  <div className="category-icon">
                    {category.icon}
                  </div>
                  <h3 className="category-title">{category.title}</h3>
                  <p className="category-description">{category.description}</p>
                  <div className="card-shine"></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;