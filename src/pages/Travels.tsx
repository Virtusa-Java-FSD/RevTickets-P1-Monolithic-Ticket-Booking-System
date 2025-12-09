import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/travel.css";

interface TravelOption {
  id: string;
  name: string;
  type: 'flight' | 'bus' | 'train';
  imageUrl: string;
  rating?: number;
  serviceType: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  route: string;
}

const Travels = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Flights');
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    date: ''
  });
  const [filters, setFilters] = useState({
    stops: 'all',
    priceRange: [0, 10000],
    airlines: [] as string[],
    sortBy: 'recommended'
  });
  const [travelOptions, setTravelOptions] = useState<TravelOption[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<TravelOption[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const navigate = useNavigate();

  const bannerImages = [
    {
      url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      title: 'Travel Booking',
      subtitle: 'Flights • Buses • Trains'
    },
    {
      url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      title: 'Book Your Journey',
      subtitle: 'Best prices guaranteed'
    },
    {
      url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      title: 'Travel Anywhere',
      subtitle: 'Comfortable & Safe'
    }
  ];

  useEffect(() => {
    loadTravelOptions();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [bannerImages.length]);

  const loadTravelOptions = () => {
    const mockOptions: TravelOption[] = [
      {
        id: '1',
        name: 'Air India',
        type: 'flight',
        imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop',
        rating: 4.2,
        serviceType: 'Economy',
        departure: '08:00',
        arrival: '10:30',
        duration: '2h 30m',
        price: 5500,
        route: 'DEL → BOM'
      },
      {
        id: '2',
        name: 'RedBus Express',
        type: 'bus',
        imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
        rating: 4.0,
        serviceType: 'AC Sleeper',
        departure: '22:00',
        arrival: '06:00',
        duration: '8h 00m',
        price: 1200,
        route: 'Mumbai → Delhi'
      },
      {
        id: '3',
        name: 'Rajdhani Express',
        type: 'train',
        imageUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&h=300&fit=crop',
        rating: 4.5,
        serviceType: '2AC',
        departure: '16:55',
        arrival: '08:35',
        duration: '15h 40m',
        price: 2800,
        route: 'NDLS → MMCT'
      },
      {
        id: '4',
        name: 'IndiGo',
        type: 'flight',
        imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop',
        rating: 4.3,
        serviceType: 'Economy',
        departure: '14:15',
        arrival: '16:45',
        duration: '2h 30m',
        price: 4200,
        route: 'BLR → MAA'
      },
      {
        id: '5',
        name: 'Travels Plus',
        type: 'bus',
        imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
        rating: 3.8,
        serviceType: 'AC Seater',
        departure: '06:30',
        arrival: '12:00',
        duration: '5h 30m',
        price: 800,
        route: 'Pune → Mumbai'
      },
      {
        id: '6',
        name: 'Shatabdi Express',
        type: 'train',
        imageUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&h=300&fit=crop',
        rating: 4.4,
        serviceType: 'CC',
        departure: '06:00',
        arrival: '11:00',
        duration: '5h 00m',
        price: 1500,
        route: 'NDLS → AGC'
      }
    ];
    setTravelOptions(mockOptions);
    setFilteredOptions(mockOptions);
  };

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      let filtered = travelOptions.filter(option => {
        if (activeTab === 'Flights') return option.type === 'flight';
        if (activeTab === 'Buses') return option.type === 'bus';
        if (activeTab === 'Trains') return option.type === 'train';
        return false;
      });
      setFilteredOptions(filtered);
      setLoading(false);
    }, 1000);
  };







  return (
    <div className="travels-page">
      <div className="container-fluid">
        {/* Banner Carousel */}
        <div className="banner-carousel">
          {bannerImages.map((banner, index) => (
            <div
              key={index}
              className={`banner-slide ${index === currentBannerIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url(${banner.url})` }}
            >
              <div className="banner-overlay"></div>
              <div className="banner-content">
                <div className="container">
                  <h2 className="text-white display-5 fw-bold">{banner.title}</h2>
                  <p className="text-white-50">{banner.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="travels-header py-4 bg-dark text-white">
          <div className="container">
            <h1 className="h3 mb-1">Travel Booking</h1>
            <p className="mb-0 small">Book flights, buses, and trains at best prices!</p>
            
          </div>
        </div>

        {/* Travel Tabs - Moved outside header */}
        <div className="container">
          <div className="travel-tabs-wrapper">
            <button 
              className={`travel-tab ${activeTab === 'Flights' ? 'active-tab' : ''}`}
              onClick={() => setActiveTab('Flights')}
            >
              Flights
            </button>
            <button 
              className={`travel-tab ${activeTab === 'Buses' ? 'active-tab' : ''}`}
              onClick={() => setActiveTab('Buses')}
            >
              Buses
            </button>
            <button 
              className={`travel-tab ${activeTab === 'Trains' ? 'active-tab' : ''}`}
              onClick={() => setActiveTab('Trains')}
            >
              Trains
            </button>
          </div>

          {/* Compact Filter Bar */}
          <div className="compact-filter-bar">
              <input 
                type="text" 
                placeholder="From City" 
                className="city-input"
                value={searchData.from}
                onChange={(e) => setSearchData({...searchData, from: e.target.value})}
              />
              <button className="swap-btn" onClick={() => setSearchData({...searchData, from: searchData.to, to: searchData.from})}>
                ↔
              </button>
              <input 
                type="text" 
                placeholder="To City" 
                className="city-input"
                value={searchData.to}
                onChange={(e) => setSearchData({...searchData, to: e.target.value})}
              />
              <div className="date-group">
                <input 
                  type="date" 
                  className="date-input"
                  value={searchData.date}
                  onChange={(e) => setSearchData({...searchData, date: e.target.value})}
                />
                <button className="date-btn" onClick={() => setSearchData({...searchData, date: new Date().toISOString().split('T')[0]})}>
                  Today
                </button>
                <button className="date-btn" onClick={() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  setSearchData({...searchData, date: tomorrow.toISOString().split('T')[0]});
                }}>
                  Tomorrow
                </button>
              </div>

            <button className="search-btn" onClick={handleSearch}>
              Search
            </button>
          </div>

          {/* Flight Filters */}
          {activeTab === 'Flights' && (
            <div className="flight-filters">
              <div className="filter-section">
                <label>Stops</label>
                <select value={filters.stops} onChange={(e) => setFilters({...filters, stops: e.target.value})}>
                  <option value="all">All</option>
                  <option value="direct">Direct</option>
                  <option value="1stop">1 Stop</option>
                  <option value="2plus">2+ Stops</option>
                </select>
              </div>
              <div className="filter-section">
                <label>Price Range</label>
                <input type="range" min="0" max="10000" value={filters.priceRange[1]} onChange={(e) => setFilters({...filters, priceRange: [0, parseInt(e.target.value)]})} />
                <span>₹0 - ₹{filters.priceRange[1]}</span>
              </div>
              <div className="filter-section">
                <label>Sort By</label>
                <select value={filters.sortBy} onChange={(e) => setFilters({...filters, sortBy: e.target.value})}>
                  <option value="recommended">Recommended</option>
                  <option value="cheapest">Cheapest</option>
                  <option value="fastest">Fastest</option>
                </select>
              </div>
            </div>
          )}
        </div>



        {/* Results Grid */}
        <div className="container mb-5" style={{marginTop: '20px'}}>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Searching travel options...</p>
            </div>
          ) : filteredOptions.length === 0 ? (
            <div className="alert alert-info text-center py-5">
              <p className="mb-0">No travel options found. Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <p className="text-muted mb-4">
                Showing <strong>{filteredOptions.length}</strong> travel option{filteredOptions.length !== 1 ? "s" : ""}
              </p>
              <div className="row g-2">
                {(() => {
                  const filteredOptions = travelOptions.filter((item) => {
                    if (activeTab === "Flights") return item.type === "flight";
                    if (activeTab === "Buses") return item.type === "bus";
                    if (activeTab === "Trains") return item.type === "train";
                    return false;
                  });
                  return filteredOptions.map((option) => (
                  <div key={option.id} style={{ flex: '0 0 20%', maxWidth: '20%', padding: '0 0.25rem' }}>
                    <div className="travel-card">
                      <div className="travel-image-wrapper">
                        <img 
                          src={option.imageUrl} 
                          alt={option.name}
                          className="travel-image"
                        />
                        <div className="travel-overlay">
                          <div className="overlay-content">
                            <button 
                              className="book-btn"
                              onClick={() => {
                                if (option.type === 'bus') {
                                  navigate('/bus-seat-selection', { state: option });
                                } else if (option.type === 'train') {
                                  navigate('/train-class-selection', { state: option });
                                } else {
                                  navigate('/booking-details', { state: option });
                                }
                              }}
                            >
                              {option.type === 'bus' ? 'Select Seats' : option.type === 'train' ? 'Select Class' : 'Book Now'}
                            </button>
                          </div>
                        </div>
                        {option.rating && (
                          <div className="rating-badge">
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="#fbbf24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            <span>{option.rating}/5</span>
                          </div>
                        )}

                      </div>
                      <div className="travel-info">
                        <h3 className="travel-title">{option.name}</h3>
                        <div className="travel-meta">
                          <span className="service-type">{option.serviceType}</span>
                          <span className="route">{option.route}</span>
                        </div>
                        <div className="travel-timing">
                          {option.departure} → {option.arrival} ({option.duration})
                        </div>
                        <div className="travel-price">₹{option.price} onwards</div>
                      </div>
                    </div>
                  </div>
                  ));
                })()}
              </div>
            </>
          )}
        </div>
      </div>
      

    </div>
  );
};

export default Travels;