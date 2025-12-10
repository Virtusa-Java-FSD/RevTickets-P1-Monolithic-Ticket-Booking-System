import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/travel.css";
import "../styles/busSeatSelection.css";

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
  isAC?: boolean;
  busType?: 'Seater' | 'Sleeper' | 'Seater/Sleeper';
  layout?: '(2+1)' | '(1+1)' | '(2+2)';
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
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [selectedBus, setSelectedBus] = useState<TravelOption | null>(null);
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
        route: 'Mumbai → Delhi',
        isAC: true,
        busType: 'Sleeper',
        layout: '(2+1)'
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
        route: 'Pune → Mumbai',
        isAC: true,
        busType: 'Seater',
        layout: '(2+2)'
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
      },
      {
        id: '7',
        name: 'Orange Travels',
        type: 'bus',
        imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
        rating: 4.1,
        serviceType: 'Non-AC Seater',
        departure: '14:30',
        arrival: '18:00',
        duration: '3h 30m',
        price: 450,
        route: 'Chennai → Bangalore',
        isAC: false,
        busType: 'Seater',
        layout: '(2+2)'
      },
      {
        id: '8',
        name: 'VRL Travels',
        type: 'bus',
        imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
        rating: 4.3,
        serviceType: 'AC Seater/Sleeper',
        departure: '20:15',
        arrival: '05:45',
        duration: '9h 30m',
        price: 1500,
        route: 'Hyderabad → Mumbai',
        isAC: true,
        busType: 'Seater/Sleeper',
        layout: '(2+1)'
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

  const getBusBadge = (option: TravelOption) => {
    if (option.type !== 'bus') return null;
    const acText = option.isAC ? 'AC' : 'Non-AC';
    const busType = option.busType || 'Seater';
    const layout = option.layout || '';
    return `${acText} ${busType} ${layout}`.trim();
  };







  return (
    <div className="travels-page">
      <div className="container-fluid p-0">
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
              tabIndex={0}
            >
              Flights
            </button>
            <button 
              className={`travel-tab ${activeTab === 'Buses' ? 'active-tab' : ''}`}
              onClick={() => setActiveTab('Buses')}
              tabIndex={-1}
            >
              Buses
            </button>
            <button 
              className={`travel-tab ${activeTab === 'Trains' ? 'active-tab' : ''}`}
              onClick={() => setActiveTab('Trains')}
              tabIndex={0}
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
                                  setSelectedBus(option);
                                  setShowSeatModal(true);
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
                        {option.type === 'bus' && (
                          <div className="bus-badge-wrapper">
                            <span className={`bus-badge ${option.isAC ? 'bus-badge-ac' : 'bus-badge-nonac'}`}>
                              <span className="bus-badge-icon">
                                {option.isAC ? '❄️' : '☀️'}
                              </span>
                              {getBusBadge(option)}
                            </span>
                          </div>
                        )}
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
      
      {/* Bus Seat Selection Modal */}
      {showSeatModal && selectedBus && (
        <BusSeatModal 
          busData={selectedBus} 
          onClose={() => setShowSeatModal(false)}
          onContinue={(selectedSeats, totalFare) => {
            setShowSeatModal(false);
            navigate('/bus-boarding-drop', { 
              state: { 
                busData: selectedBus, 
                selectedSeats,
                totalFare
              } 
            });
          }}
        />
      )}
    </div>
  );
};

// Bus Seat Modal Component
interface BusSeatModalProps {
  busData: TravelOption;
  onClose: () => void;
  onContinue: (selectedSeats: any[], totalFare: number) => void;
}

interface Seat {
  id: string;
  row: number;
  col: string;
  number: string;
  price: number;
  status: 'available' | 'booked' | 'selected';
  deck: 'lower' | 'upper';
  gender?: 'Male' | 'Female';
  type?: 'Seater' | 'Sleeper';
}

const BusSeatModal: React.FC<BusSeatModalProps> = ({ busData, onClose, onContinue }) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [hasUpperDeck, setHasUpperDeck] = useState(true);

  useEffect(() => {
    generateSeats();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const generateSeats = () => {
    const allSeats: Seat[] = [];
    const columns = ['A', 'B', 'C', 'D'];
    const upperDeckExists = Math.random() > 0.3;
    
    for (let row = 1; row <= 9; row++) {
      columns.forEach(col => {
        const random = Math.random();
        const isBooked = random > 0.7;
        allSeats.push({
          id: `L${row}${col}`,
          row,
          col,
          number: `${row}${col}`,
          price: 1200,
          status: isBooked ? 'booked' : 'available',
          deck: 'lower',
          gender: isBooked ? (Math.random() > 0.5 ? 'Male' : 'Female') : undefined,
          type: Math.random() > 0.5 ? 'Seater' : 'Sleeper'
        });
      });
    }
    
    if (upperDeckExists) {
      for (let row = 1; row <= 9; row++) {
        columns.forEach(col => {
          const random = Math.random();
          const isBooked = random > 0.7;
          allSeats.push({
            id: `U${row}${col}`,
            row,
            col,
            number: `${row}${col}`,
            price: 1200,
            status: isBooked ? 'booked' : 'available',
            deck: 'upper',
            gender: isBooked ? (Math.random() > 0.5 ? 'Male' : 'Female') : undefined,
            type: Math.random() > 0.5 ? 'Seater' : 'Sleeper'
          });
        });
      }
    }
    
    setHasUpperDeck(upperDeckExists);
    setSeats(allSeats);
  };

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'booked') return;
    
    const isSelected = selectedSeats.find(s => s.id === seat.id);
    
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
      setSeats(seats.map(s => s.id === seat.id ? { ...s, status: 'available' } : s));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
      setSeats(seats.map(s => s.id === seat.id ? { ...s, status: 'selected' } : s));
    }
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) return;
    const totalFare = selectedSeats.reduce((sum, s) => sum + s.price, 0);
    onContinue(selectedSeats, totalFare);
  };

  const renderDeck = (deckType: 'lower' | 'upper') => {
    const deckSeats = seats.filter(s => s.deck === deckType);
    const rows = Array.from(new Set(deckSeats.map(s => s.row))).sort((a, b) => a - b);
    
    return (
      <div className="card border-0 shadow-sm h-100">
        <div className="card-body">
          <h5 className="card-title mb-4 text-capitalize">{deckType} Deck</h5>
          <div className="d-flex flex-column align-items-center gap-3">
            <span className="badge bg-primary rounded-pill px-3 py-2">FRONT</span>
            {rows.map(row => (
              <div key={row} className="d-flex align-items-center gap-2">
                <span className="seat-row-number">{row}</span>
                <div className="d-flex gap-2">
                  {['A', 'B'].map(col => {
                    const seat = deckSeats.find(s => s.row === row && s.col === col);
                    return seat ? (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat)}
                        disabled={seat.status === 'booked'}
                        className={`seat-btn ${seat.status === 'booked' && seat.gender === 'Male' ? 'seat-booked-male' : seat.status === 'booked' && seat.gender === 'Female' ? 'seat-booked-female' : seat.status} ${seat.type === 'Sleeper' ? 'sleeper' : ''}`}
                      >
                        {seat.col}
                      </button>
                    ) : <div key={col} style={{width: '48px'}} />;
                  })}
                </div>
                <div className="seat-aisle" />
                <div className="d-flex gap-2">
                  {['C', 'D'].map(col => {
                    const seat = deckSeats.find(s => s.row === row && s.col === col);
                    return seat ? (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat)}
                        disabled={seat.status === 'booked'}
                        className={`seat-btn ${seat.status === 'booked' && seat.gender === 'Male' ? 'seat-booked-male' : seat.status === 'booked' && seat.gender === 'Female' ? 'seat-booked-female' : seat.status} ${seat.type === 'Sleeper' ? 'sleeper' : ''}`}
                      >
                        {seat.col}
                      </button>
                    ) : <div key={col} style={{width: '48px'}} />;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bus-seat-modal-overlay" onClick={onClose}>
      <div className="bus-seat-modal-container modal-xl" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header bg-gradient text-white border-0">
            <div>
              <h4 className="modal-title mb-1">{busData.name}</h4>
              <p className="mb-0 small opacity-75">Select your seats</p>
              <span className={`badge ${busData.isAC ? 'badge-ac' : 'badge-nonac'} mt-2`}>
                {busData.serviceType}
              </span>
            </div>
            <button 
              type="button" 
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>
          
          <div className="modal-body bg-light p-4">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body py-3">
                <div className="d-flex justify-content-center gap-4 flex-wrap">
                  <div className="d-flex align-items-center gap-2">
                    <div className="seat-legend available"></div>
                    <small className="fw-medium">Available</small>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <div className="seat-legend booked-male"></div>
                    <small className="fw-medium">Booked (Male)</small>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <div className="seat-legend booked-female"></div>
                    <small className="fw-medium">Booked (Female)</small>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <div className="seat-legend selected"></div>
                    <small className="fw-medium">Selected</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-4">
              <div className={hasUpperDeck ? "col-lg-4" : "col-lg-6 mx-auto"}>{renderDeck('lower')}</div>
              {hasUpperDeck && <div className="col-lg-4">{renderDeck('upper')}</div>}
              
              <div className={hasUpperDeck ? "col-lg-4" : "col-lg-6"}>
                <div className="card border-0 shadow-sm sticky-top" style={{top: '20px'}}>
                  <div className="card-body">
                    <h5 className="card-title mb-3">Selected Seats ({selectedSeats.length}/4)</h5>
                    
                    {selectedSeats.length === 0 ? (
                      <p className="text-muted text-center py-5 small">No seats selected</p>
                    ) : (
                      <div className="mb-4">
                        {selectedSeats.map(seat => (
                          <div key={seat.id} className="d-flex justify-content-between align-items-center p-2 bg-light rounded mb-2">
                            <span className="fw-medium">Seat {seat.number}</span>
                            <span className="text-success fw-bold">₹{seat.price}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="border-top pt-3 mb-4">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fs-5 fw-semibold">Total:</span>
                        <span className="fs-4 fw-bold text-success">
                          ₹{selectedSeats.reduce((sum, s) => sum + s.price, 0)}
                        </span>
                      </div>
                    </div>

                    <div className="d-grid gap-2">
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                      <button 
                        className="btn btn-primary btn-lg"
                        onClick={handleContinue}
                        disabled={selectedSeats.length === 0}
                      >
                        Continue ({selectedSeats.length} seats)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Travels;