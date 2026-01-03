import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "../components/AuthModal";
import "../styles/travel.css";
import "../styles/busSeatSelection.css";
import Footer from "../components/Footer";

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
    sortBy: 'recommended',
    acType: [] as string[],
    busType: [] as string[],
    trainClass: [] as string[],
    rating: 0,
    departureTime: [] as string[]
  });
  const [travelOptions, setTravelOptions] = useState<TravelOption[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<TravelOption[]>([]);
  const [allTravels, setAllTravels] = useState<TravelOption[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [selectedBus, setSelectedBus] = useState<TravelOption | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
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

  useEffect(() => {
    console.log('Filtering by activeTab:', activeTab);
    console.log('All travels count:', allTravels.length);
    console.log('All travels types:', allTravels.map(t => t.type));
    
    const filtered = allTravels.filter(option => {
      if (activeTab === 'Flights') return option.type === 'flight';
      if (activeTab === 'Buses') return option.type === 'bus';
      if (activeTab === 'Trains') return option.type === 'train';
      return false;
    });
    
    console.log('Filtered count:', filtered.length);
    setTravelOptions(filtered);
    applyFilters(filtered);
  }, [activeTab, allTravels]);

  const transformTravelData = (data: any[]): TravelOption[] => {
    return data.map((travel: any) => ({
      id: travel.id?.toString() || '',
      name: travel.operator,
      type: travel.type,
      imageUrl: travel.type === 'flight'
        ? 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop'
        : travel.type === 'bus'
          ? 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop'
          : 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&h=300&fit=crop',
      rating: travel.rating || 4.0,
      serviceType: travel.type === 'flight' ? 'Economy' : travel.type === 'bus' ? 'AC Sleeper' : '2AC',
      departure: travel.departureTime,
      arrival: travel.arrivalTime,
      duration: travel.duration,
      price: travel.price,
      route: `${travel.departure} → ${travel.arrival}`,
      isAC: true,
      busType: 'Sleeper' as const,
      layout: '(2+1)' as const
    }));
  };

  const loadTravelOptions = async () => {
    setLoading(true);
    try {
      const { getTravels } = await import('../utils/api');
      const data = await getTravels();
      console.log('Travel data from API:', data);
      console.log('Data length:', data?.length || 0);
      
      if (!data || data.length === 0) {
        console.warn('No travel data received from API');
        setTravelOptions([]);
        setFilteredOptions([]);
        setAllTravels([]);
        return;
      }
      
      const transformedData = transformTravelData(data);
      console.log('Transformed data:', transformedData);
      console.log('Transformed data length:', transformedData.length);
      
      setAllTravels(transformedData);
      setTravelOptions(transformedData);
      applyFilters(transformedData);
    } catch (error) {
      console.error('Failed to load travel options:', error);
      console.error('Error details:', error);
      setTravelOptions([]);
      setFilteredOptions([]);
      setAllTravels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchData.from || !searchData.to) {
      alert('Please enter both From and To locations');
      return;
    }

    setLoading(true);
    try {
      const { searchTravels, getFlights, getBuses, getTrains } = await import('../utils/api');
      let data: any[] = [];

      if (activeTab === 'Flights') {
        data = await getFlights(searchData.from, searchData.to);
      } else if (activeTab === 'Buses') {
        data = await getBuses(searchData.from, searchData.to);
      } else if (activeTab === 'Trains') {
        data = await getTrains(searchData.from, searchData.to);
      } else {
        data = await searchTravels(activeTab.toLowerCase().slice(0, -1), searchData.from, searchData.to);
      }

      const transformedData = transformTravelData(data);
      setTravelOptions(transformedData);
      applyFilters(transformedData);
    } catch (error) {
      console.error('Search failed:', error);
      alert('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (options: TravelOption[]) => {
    let filtered = options.filter(option => {
      if (activeTab === 'Flights' && option.type !== 'flight') return false;
      if (activeTab === 'Buses' && option.type !== 'bus') return false;
      if (activeTab === 'Trains' && option.type !== 'train') return false;

      if (option.price < filters.priceRange[0] || option.price > filters.priceRange[1]) {
        return false;
      }

      if (filters.rating > 0 && (option.rating || 0) < filters.rating) {
        return false;
      }

      if (activeTab === 'Flights' && filters.airlines.length > 0) {
        if (!filters.airlines.includes(option.name)) return false;
      }

      if (activeTab === 'Buses') {
        if (filters.acType.length > 0) {
          const hasAC = filters.acType.includes('AC') && option.isAC;
          const hasNonAC = filters.acType.includes('Non-AC') && !option.isAC;
          if (!hasAC && !hasNonAC) return false;
        }
        if (filters.busType.length > 0 && option.busType) {
          if (!filters.busType.includes(option.busType)) return false;
        }
      }

      if (activeTab === 'Trains' && filters.trainClass.length > 0) {
        if (!filters.trainClass.some(cls => option.serviceType?.includes(cls))) return false;
      }

      return true;
    });

    filtered = sortOptions(filtered);
    setFilteredOptions(filtered);
  };

  const sortOptions = (options: TravelOption[]): TravelOption[] => {
    const sorted = [...options];
    switch (filters.sortBy) {
      case 'cheapest':
        return sorted.sort((a, b) => a.price - b.price);
      case 'fastest':
        return sorted.sort((a, b) => {
          const aDuration = parseDuration(a.duration);
          const bDuration = parseDuration(b.duration);
          return aDuration - bDuration;
        });
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'departure':
        return sorted.sort((a, b) => a.departure.localeCompare(b.departure));
      case 'arrival':
        return sorted.sort((a, b) => a.arrival.localeCompare(b.arrival));
      default:
        return sorted;
    }
  };

  const parseDuration = (duration: string): number => {
    const match = duration.match(/(\d+)h\s*(\d+)?m?/);
    if (match) {
      const hours = parseInt(match[1]) || 0;
      const minutes = parseInt(match[2]) || 0;
      return hours * 60 + minutes;
    }
    return 0;
  };

  useEffect(() => {
    if (travelOptions.length > 0) {
      applyFilters(travelOptions);
    }
  }, [filters]);

  const getBusBadge = (option: TravelOption) => {
    if (option.type !== 'bus') return null;
    const acText = option.isAC ? 'AC' : 'Non-AC';
    const busType = option.busType || 'Seater';
    const layout = option.layout || '';
    return `${acText} ${busType} ${layout}`.trim();
  };

  const checkAuthAndProceed = (callback: () => void) => {
    const authData = localStorage.getItem('rev_auth');
    if (!authData) {
      setShowAuthModal(true);
      return;
    }
    callback();
  };

  const handleAuthModalLogin = () => {
    setShowAuthModal(false);
    navigate('/login');
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
              onChange={(e) => setSearchData({ ...searchData, from: e.target.value })}
            />
            <button className="swap-btn" onClick={() => setSearchData({ ...searchData, from: searchData.to, to: searchData.from })}>
              ↔
            </button>
            <input
              type="text"
              placeholder="To City"
              className="city-input"
              value={searchData.to}
              onChange={(e) => setSearchData({ ...searchData, to: e.target.value })}
            />
            <div className="date-group">
              <input
                type="date"
                className="date-input"
                value={searchData.date}
                onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
              />
              <button className="date-btn" onClick={() => setSearchData({ ...searchData, date: new Date().toISOString().split('T')[0] })}>
                Today
              </button>
              <button className="date-btn" onClick={() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                setSearchData({ ...searchData, date: tomorrow.toISOString().split('T')[0] });
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
                <select value={filters.stops} onChange={(e) => setFilters({ ...filters, stops: e.target.value })}>
                  <option value="all">All</option>
                  <option value="direct">Direct</option>
                  <option value="1stop">1 Stop</option>
                  <option value="2plus">2+ Stops</option>
                </select>
              </div>
              <div className="filter-section">
                <label>Price Range</label>
                <input type="range" min="0" max="10000" value={filters.priceRange[1]} onChange={(e) => setFilters({ ...filters, priceRange: [0, parseInt(e.target.value)] })} />
                <span>₹0 - ₹{filters.priceRange[1]}</span>
              </div>
              <div className="filter-section">
                <label>Sort By</label>
                <select value={filters.sortBy} onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}>
                  <option value="recommended">Recommended</option>
                  <option value="cheapest">Cheapest</option>
                  <option value="fastest">Fastest</option>
                </select>
              </div>
            </div>
          )}
        </div>



        {/* Results Grid */}
        <div className="container mb-5" style={{ marginTop: '20px' }}>
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
            <div className="results-layout">
              {/* Sidebar Filters */}
              <div className="filters-sidebar">
                <div className="filters-header">
                  <h5>Filters</h5>
                  <button 
                    className="clear-all-btn"
                    onClick={() => {
                      setFilters({
                        stops: 'all',
                        priceRange: [0, 10000],
                        airlines: [],
                        sortBy: 'recommended',
                        acType: [],
                        busType: [],
                        trainClass: [],
                        rating: 0,
                        departureTime: []
                      });
                    }}
                  >
                    Clear All
                  </button>
                </div>

                {/* Flight Filters */}
                {activeTab === 'Flights' && (
                  <div className="filter-sections">
                    <div className="filter-group">
                      <h6>Popular Filters</h6>
                      <label className="filter-checkbox">
                        <input 
                          type="checkbox" 
                          checked={filters.stops === 'direct'}
                          onChange={(e) => setFilters({ ...filters, stops: e.target.checked ? 'direct' : 'all' })}
                        />
                        <span>Non Stop</span>
                      </label>
                      {Array.from(new Set(travelOptions.filter(o => o.type === 'flight').map(o => o.name))).map(airline => (
                        <label key={airline} className="filter-checkbox">
                          <input 
                            type="checkbox" 
                            checked={filters.airlines.includes(airline)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters({ ...filters, airlines: [...filters.airlines, airline] });
                              } else {
                                setFilters({ ...filters, airlines: filters.airlines.filter(a => a !== airline) });
                              }
                            }}
                          />
                          <span>{airline}</span>
                        </label>
                      ))}
                    </div>

                    <div className="filter-group">
                      <h6>Departure Airports</h6>
                      <label className="filter-checkbox">
                        <input type="checkbox" />
                        <span>Indira Gandhi International Airport</span>
                        <span className="filter-price">₹ 9,338</span>
                      </label>
                      <label className="filter-checkbox">
                        <input type="checkbox" />
                        <span>Hindon Airport (32Km)</span>
                        <span className="filter-price">₹ 10,161</span>
                      </label>
                    </div>

                    <div className="filter-group">
                      <h6>One Way Price</h6>
                      <div className="price-slider">
                        <input 
                          type="range" 
                          min="0" 
                          max={Math.max(10000, ...travelOptions.map(o => o.price))} 
                          value={filters.priceRange[1]}
                          className="slider"
                          onChange={(e) => setFilters({ ...filters, priceRange: [0, parseInt(e.target.value)] })}
                        />
                        <div className="price-range">
                          <span>₹ {filters.priceRange[0].toLocaleString()}</span>
                          <span>₹ {filters.priceRange[1].toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="filter-group">
                      <h6>Stops From New Delhi</h6>
                      <label className="filter-checkbox">
                        <input type="checkbox" />
                        <span>1 Stop</span>
                        <span className="filter-price">₹ 9,560</span>
                      </label>
                    </div>

                    <div className="filter-group">
                      <h6>Departure From New Delhi</h6>
                      <div className="time-filters">
                        <div className="time-slot">
                          <span className="time-icon">🌅</span>
                          <div>
                            <div>Before 6 am</div>
                          </div>
                        </div>
                        <div className="time-slot">
                          <span className="time-icon">☀️</span>
                          <div>
                            <div>6 am - 12 pm</div>
                          </div>
                        </div>
                        <div className="time-slot">
                          <span className="time-icon">🌤️</span>
                          <div>
                            <div>12 pm - 6 pm</div>
                          </div>
                        </div>
                        <div className="time-slot">
                          <span className="time-icon">🌙</span>
                          <div>
                            <div>After 6 pm</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="filter-group">
                      <h6>Rating</h6>
                      <label className="filter-checkbox">
                        <input 
                          type="checkbox" 
                          checked={filters.rating === 4}
                          onChange={(e) => setFilters({ ...filters, rating: e.target.checked ? 4 : 0 })}
                        />
                        <span>⭐⭐⭐⭐ 4+ & above</span>
                      </label>
                      <label className="filter-checkbox">
                        <input 
                          type="checkbox" 
                          checked={filters.rating === 3.5}
                          onChange={(e) => setFilters({ ...filters, rating: e.target.checked ? 3.5 : 0 })}
                        />
                        <span>⭐⭐⭐ 3.5+ & above</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Bus Filters */}
                {activeTab === 'Buses' && (
                  <div className="filter-sections">
                    <div className="filter-group">
                      <h6>AC / Non-AC</h6>
                      <label className="filter-checkbox">
                        <input 
                          type="checkbox" 
                          checked={filters.acType.includes('AC')}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({ ...filters, acType: [...filters.acType, 'AC'] });
                            } else {
                              setFilters({ ...filters, acType: filters.acType.filter(t => t !== 'AC') });
                            }
                          }}
                        />
                        <span>AC</span>
                      </label>
                      <label className="filter-checkbox">
                        <input 
                          type="checkbox" 
                          checked={filters.acType.includes('Non-AC')}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({ ...filters, acType: [...filters.acType, 'Non-AC'] });
                            } else {
                              setFilters({ ...filters, acType: filters.acType.filter(t => t !== 'Non-AC') });
                            }
                          }}
                        />
                        <span>Non-AC</span>
                      </label>
                    </div>

                    <div className="filter-group">
                      <h6>Bus Type</h6>
                      {['Sleeper', 'Seater', 'Seater/Sleeper'].map(busType => (
                        <label key={busType} className="filter-checkbox">
                          <input 
                            type="checkbox" 
                            checked={filters.busType.includes(busType)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters({ ...filters, busType: [...filters.busType, busType] });
                              } else {
                                setFilters({ ...filters, busType: filters.busType.filter(t => t !== busType) });
                              }
                            }}
                          />
                          <span>{busType}</span>
                        </label>
                      ))}
                    </div>

                    <div className="filter-group">
                      <h6>Departure Time</h6>
                      <div className="time-filters">
                        <div className="time-slot">
                          <span className="time-icon">🌅</span>
                          <div>
                            <div>Morning</div>
                            <small>6AM - 12PM</small>
                          </div>
                        </div>
                        <div className="time-slot">
                          <span className="time-icon">☀️</span>
                          <div>
                            <div>Afternoon</div>
                            <small>12PM - 6PM</small>
                          </div>
                        </div>
                        <div className="time-slot">
                          <span className="time-icon">🌆</span>
                          <div>
                            <div>Evening</div>
                            <small>6PM - 12AM</small>
                          </div>
                        </div>
                        <div className="time-slot">
                          <span className="time-icon">🌙</span>
                          <div>
                            <div>Night</div>
                            <small>12AM - 6AM</small>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="filter-group">
                      <h6>Arrival Time</h6>
                      <div className="collapsible-filter">▼</div>
                    </div>

                    <div className="filter-group">
                      <h6>Bus Operators</h6>
                      <div className="collapsible-filter">▼</div>
                    </div>

                    <div className="filter-group">
                      <h6>Rating</h6>
                      <label className="filter-checkbox">
                        <input 
                          type="checkbox" 
                          checked={filters.rating === 4}
                          onChange={(e) => setFilters({ ...filters, rating: e.target.checked ? 4 : 0 })}
                        />
                        <span>⭐⭐⭐⭐ 4+ & above</span>
                      </label>
                      <label className="filter-checkbox">
                        <input 
                          type="checkbox" 
                          checked={filters.rating === 3.5}
                          onChange={(e) => setFilters({ ...filters, rating: e.target.checked ? 3.5 : 0 })}
                        />
                        <span>⭐⭐⭐ 3.5+ & above</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Train Filters */}
                {activeTab === 'Trains' && (
                  <div className="filter-sections">
                    <div className="filter-group">
                      <h6>Ticket class</h6>
                      {['2A', '3A', 'SL', '1A'].map(trainClass => (
                        <label key={trainClass} className="filter-checkbox">
                          <input 
                            type="checkbox" 
                            checked={filters.trainClass.includes(trainClass)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters({ ...filters, trainClass: [...filters.trainClass, trainClass] });
                              } else {
                                setFilters({ ...filters, trainClass: filters.trainClass.filter(c => c !== trainClass) });
                              }
                            }}
                          />
                          <span>
                            {trainClass === '2A' ? 'AC 2 Tier (2A)' :
                             trainClass === '3A' ? 'AC 3 Tier (3A)' :
                             trainClass === 'SL' ? 'Sleeper (SL)' :
                             'AC First Class (1A)'}
                          </span>
                        </label>
                      ))}
                    </div>

                    <div className="filter-group">
                      <h6>Quota</h6>
                      <label className="filter-radio">
                        <input type="radio" name="quota" checked />
                        <span>General + Tatkal</span>
                      </label>
                      <label className="filter-radio">
                        <input type="radio" name="quota" />
                        <span>Senior citizen (SS)</span>
                      </label>
                      <label className="filter-radio">
                        <input type="radio" name="quota" />
                        <span>Ladies quota (LD)</span>
                      </label>
                    </div>

                    <div className="filter-group">
                      <h6>Departure time range</h6>
                      <div className="collapsible-filter">▼</div>
                    </div>

                    <div className="filter-group">
                      <h6>Arrival time range</h6>
                      <div className="collapsible-filter">▼</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Results Content */}
              <div className="results-content">
                <div className="results-header">
                  <p className="results-count">
                    {activeTab === 'Buses' ? `${filteredOptions.length} buses found` :
                      activeTab === 'Trains' ? `${filteredOptions.length} Trains` :
                        `Flights from New Delhi to Mumbai`}
                  </p>
                  <div className="sort-options">
                    <span>Sort by:</span>
                    <select 
                      className="sort-select"
                      value={filters.sortBy}
                      onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    >
                      <option value="recommended">Recommended</option>
                      <option value="cheapest">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="fastest">Duration</option>
                      <option value="departure">Departure</option>
                      <option value="arrival">Arrival</option>
                    </select>
                  </div>
                </div>
                <div className="results-container">
                  {(() => {
                    const filtered = filteredOptions;

                    return filtered.map((option) => {
                      // Unified Card Structure based on Flight Card
                      const isCheapest = option.price < 5000; // Example logic
                      const badgeText = isCheapest ? "CHEAPEST" : null;

                      const handleViewClick = () => {
                        checkAuthAndProceed(() => {
                          if (option.type === 'flight') {
                            navigate('/booking-details', { state: option });
                          } else if (option.type === 'bus') {
                            setSelectedBus(option);
                            setShowSeatModal(true);
                          } else if (option.type === 'train') {
                            // For trains, maybe default to Sleeper for the generic view, or open a class selector?
                            // Matching "View Fares" behavior -> go to booking details with default/selected class
                            // Or just navigate to existing booking flow
                            navigate('/booking-details', { state: { ...option, selectedClass: 'SL', selectedPrice: option.price } });
                          }
                        });
                      };

                      const subTitle = option.type === 'flight' ? option.serviceType
                        : option.type === 'bus' ? (option.busType || 'Sleeper')
                          : `#${option.id}`;

                      const durationSubText = option.type === 'flight' ? "Non-stop"
                        : option.type === 'bus' ? "Rest Stop"
                          : "Runs Daily";

                      const buttonText = option.type === 'flight' ? "VIEW FARES"
                        : option.type === 'bus' ? "VIEW SEATS"
                          : "VIEW FARES";

                      return (
                        <div key={option.id} className="flight-result-card">
                          <div className="flight-card-content">
                            <div className="airline-info">
                              <div className="airline-logo">
                                <img src={option.imageUrl} alt={option.name} />
                              </div>
                              <div className="airline-details">
                                <h4>{option.name}</h4>
                                <span className="flight-number">{subTitle}</span>
                              </div>
                            </div>
                            <div className="flight-timing">
                              <div className="departure">
                                <span className="time">{option.departure}</span>
                                <span className="city">{option.route.split(' → ')[0]}</span>
                              </div>
                              <div className="flight-duration">
                                <div className="duration-line"></div>
                                <span className="duration">{option.duration}</span>
                                <span className="flight-type">{durationSubText}</span>
                              </div>
                              <div className="arrival">
                                <span className="time">{option.arrival}</span>
                                <span className="city">{option.route.split(' → ')[1]}</span>
                              </div>
                            </div>
                            <div className="flight-price">
                              <span className="price">₹{option.price}</span>
                              <span className="per-adult">per {option.type === 'bus' ? 'seat' : 'adult'}</span>
                            </div>
                            <div className="flight-actions">
                              {option.type !== 'train' && (
                                <button
                                  className="view-fares-btn"
                                  onClick={handleViewClick}
                                >
                                  {buttonText}
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Train Classes Row */}
                          {option.type === 'train' && (
                            <div className="train-classes-row">
                              <div className="class-box" onClick={() => checkAuthAndProceed(() => navigate('/booking-details', { state: { ...option, selectedClass: 'SL', selectedPrice: Math.round(option.price * 0.4) } }))}>
                                <span className="class-name">SL</span>
                                <span className="class-price">₹{Math.round(option.price * 0.4)}</span>
                                <span className="availability">Available</span>
                              </div>
                              <div className="class-box" onClick={() => checkAuthAndProceed(() => navigate('/booking-details', { state: { ...option, selectedClass: '3A', selectedPrice: Math.round(option.price * 0.7) } }))}>
                                <span className="class-name">3A</span>
                                <span className="class-price">₹{Math.round(option.price * 0.7)}</span>
                                <span className="availability">Available</span>
                              </div>
                              <div className="class-box" onClick={() => checkAuthAndProceed(() => navigate('/booking-details', { state: { ...option, selectedClass: '2A', selectedPrice: option.price } }))}>
                                <span className="class-name">2A</span>
                                <span className="class-price">₹{option.price}</span>
                                <span className="availability">Available</span>
                              </div>
                              <div className="class-box" onClick={() => checkAuthAndProceed(() => navigate('/booking-details', { state: { ...option, selectedClass: '1A', selectedPrice: Math.round(option.price * 1.5) } }))}>
                                <span className="class-name">1A</span>
                                <span className="class-price">₹{Math.round(option.price * 1.5)}</span>
                                <span className="availability">Available</span>
                              </div>
                            </div>
                          )}

                          {badgeText && <div className="flight-badge cheapest">{badgeText}</div>}
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
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

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleAuthModalLogin}
      />
      
      <Footer />
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
                    ) : <div key={col} style={{ width: '48px' }} />;
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
                    ) : <div key={col} style={{ width: '48px' }} />;
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
                <div className="card border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
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