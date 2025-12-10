import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { Event } from "../types/Event";
import "../styles/travel.css";

const Concerts = () => {
  const navigate = useNavigate();
  const [concerts, setConcerts] = useState<Event[]>([]);
  const [filteredConcerts, setFilteredConcerts] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("title");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
  const [appliedGenres, setAppliedGenres] = useState<string[]>([]);
  const [appliedRating, setAppliedRating] = useState<string>("all");
  const [appliedSortBy, setAppliedSortBy] = useState<string>("title");
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const genreDropdownRef = useRef<HTMLDivElement>(null);

  const bannerImages = [
    {
      url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&h=400&fit=crop',
      title: 'Live Concerts',
      subtitle: 'Experience the magic of live music'
    },
    {
      url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1920&h=400&fit=crop',
      title: 'Book Your Tickets',
      subtitle: 'Best seats at best prices'
    },
    {
      url: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1920&h=400&fit=crop',
      title: 'Unforgettable Nights',
      subtitle: 'Create memories that last forever'
    }
  ];

  useEffect(() => {
    loadConcerts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (genreDropdownRef.current && !genreDropdownRef.current.contains(event.target as Node)) {
        setIsGenreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadConcerts = async () => {
    try {
      setLoading(true);
      const mockConcerts: Event[] = [
        {
          id: "c1",
          title: "Ed Sheeran World Tour",
          description: "Experience the magic of Ed Sheeran live in concert",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=400&fit=crop",
          rating: 9.2,
          genres: ["Pop"],
        },
        {
          id: "c2",
          title: "Coldplay Music of the Spheres",
          description: "Coldplay's spectacular world tour with stunning visuals",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=300&h=400&fit=crop",
          rating: 9.5,
          genres: ["Rock"],
        },
        {
          id: "c3",
          title: "AR Rahman Live",
          description: "The Mozart of Madras performs his greatest hits",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=400&fit=crop",
          rating: 9.0,
          genres: ["Classical"],
        },
        {
          id: "c4",
          title: "Arijit Singh Concert",
          description: "Bollywood's favorite voice live in concert",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=400&fit=crop",
          rating: 8.8,
          genres: ["Bollywood"],
        },
        {
          id: "c5",
          title: "Imagine Dragons Evolve Tour",
          description: "Rock the night with Imagine Dragons",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&h=400&fit=crop",
          rating: 8.9,
          genres: ["Rock"],
        },
        {
          id: "c6",
          title: "Dua Lipa Future Nostalgia",
          description: "Pop sensation Dua Lipa's electrifying performance",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&h=400&fit=crop",
          rating: 8.7,
          genres: ["Pop"],
        },
        {
          id: "c7",
          title: "Taylor Swift Eras Tour",
          description: "Journey through all of Taylor's musical eras",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=300&h=400&fit=crop",
          rating: 9.8,
          genres: ["Pop"],
        },
        {
          id: "c8",
          title: "The Weeknd After Hours",
          description: "Experience The Weeknd's electrifying performance",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&h=400&fit=crop",
          rating: 9.1,
          genres: ["Pop", "R&B"],
        },
        {
          id: "c9",
          title: "Metallica World Tour",
          description: "Heavy metal legends live on stage",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&h=400&fit=crop",
          rating: 9.3,
          genres: ["Rock", "Metal"],
        },
        {
          id: "c10",
          title: "Billie Eilish Happier Than Ever",
          description: "Intimate performance by the pop sensation",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=400&fit=crop",
          rating: 8.9,
          genres: ["Pop"],
        },
        {
          id: "c11",
          title: "BTS Permission to Dance",
          description: "K-Pop superstars in an unforgettable show",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=400&fit=crop",
          rating: 9.6,
          genres: ["K-Pop", "Pop"],
        },
        {
          id: "c12",
          title: "Shreya Ghoshal Live",
          description: "Melodious evening with India's nightingale",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=400&fit=crop",
          rating: 8.7,
          genres: ["Bollywood", "Classical"],
        },
        {
          id: "c13",
          title: "Drake It's All a Blur",
          description: "Hip-hop icon's biggest tour yet",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=300&h=400&fit=crop",
          rating: 8.8,
          genres: ["Hip-Hop", "R&B"],
        },
        {
          id: "c14",
          title: "Adele Weekends with Adele",
          description: "Powerful vocals in an intimate setting",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=300&h=400&fit=crop",
          rating: 9.4,
          genres: ["Pop", "Soul"],
        },
        {
          id: "c15",
          title: "Sunidhi Chauhan Live",
          description: "Energetic performance by Bollywood's powerhouse",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=400&fit=crop",
          rating: 8.6,
          genres: ["Bollywood"],
        },
      ];
      setConcerts(mockConcerts);
      setFilteredConcerts(mockConcerts);
    } catch (err) {
      console.error("Error loading concerts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...concerts];
    
    if (appliedSearchTerm.trim()) {
      result = result.filter(
        (concert) =>
          concert.title.toLowerCase().includes(appliedSearchTerm.toLowerCase()) ||
          concert.description.toLowerCase().includes(appliedSearchTerm.toLowerCase())
      );
    }

    if (appliedGenres.length > 0) {
      result = result.filter((concert) => 
        concert.genres?.some(genre => appliedGenres.includes(genre))
      );
    }

    if (appliedRating !== "all") {
      const minRating = parseFloat(appliedRating);
      result = result.filter((concert) => (concert.rating || 0) >= minRating);
    }

    result.sort((a, b) => {
      switch (appliedSortBy) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "title":
        default:
          return a.title.localeCompare(b.title);
      }
    });

    setFilteredConcerts(result);
  }, [appliedSearchTerm, appliedGenres, appliedRating, appliedSortBy, concerts]);

  const genres = Array.from(new Set(concerts.flatMap((concert) => concert.genres || [])));

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleSearch = () => {
    setAppliedSearchTerm(searchTerm);
    setAppliedGenres(selectedGenres);
    setAppliedRating(selectedRating);
    setAppliedSortBy(sortBy);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedGenres([]);
    setSelectedRating("all");
    setSortBy("title");
    setAppliedSearchTerm("");
    setAppliedGenres([]);
    setAppliedRating("all");
    setAppliedSortBy("title");
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
            <h1 className="h3 mb-1">🎵 Concerts</h1>
            <p className="mb-0 small">Book tickets for amazing live concerts!</p>
          </div>
        </div>

        {/* Compact Filter Bar - All in One Line */}
        <div className="container">
          <div className="compact-filter-bar">
            <input 
              type="text" 
              placeholder="🔍 Search concerts..." 
              className="city-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            {/* Genre Multi-Select */}
            <div ref={genreDropdownRef} style={{position: 'relative', minWidth: '200px'}}>
              <div 
                className="city-input" 
                style={{cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}
                onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
              >
                <span>{selectedGenres.length > 0 ? `${selectedGenres.length} Genre(s)` : 'Select Genres'}</span>
                <span>▼</span>
              </div>
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'white',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                marginTop: '4px',
                padding: '12px',
                display: isGenreDropdownOpen ? 'block' : 'none',
                zIndex: 1000,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                {genres.map((genre) => (
                  <label key={genre} style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', cursor: 'pointer'}}>
                    <input
                      type="checkbox"
                      checked={selectedGenres.includes(genre)}
                      onChange={() => toggleGenre(genre)}
                      style={{cursor: 'pointer'}}
                    />
                    <span style={{fontSize: '14px'}}>{genre}</span>
                  </label>
                ))}
                {selectedGenres.length > 0 && (
                  <button
                    onClick={() => setSelectedGenres([])}
                    style={{
                      width: '100%',
                      marginTop: '8px',
                      padding: '6px',
                      border: '1px solid #dc3545',
                      borderRadius: '6px',
                      background: 'white',
                      color: '#dc3545',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            <select
              className="city-input"
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
            >
              <option value="all">All Ratings</option>
              <option value="9">9+ ⭐</option>
              <option value="8.5">8.5+ ⭐</option>
              <option value="8">8+ ⭐</option>
              <option value="7">7+ ⭐</option>
            </select>

            <select
              className="city-input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="title">Sort by Title</option>
              <option value="rating">Sort by Rating</option>
            </select>

            <button className="search-btn" onClick={handleSearch}>
              Search
            </button>
            
            {(searchTerm || selectedGenres.length > 0 || selectedRating !== "all" || sortBy !== "title") && (
              <button 
                className="search-btn" 
                onClick={handleClearFilters}
                style={{background: 'transparent', color: '#dc3545', border: '2px solid #dc3545'}}
                title="Clear all filters"
              >
                ✕ Clear
              </button>
            )}
          </div>
        </div>

        {/* Results Grid */}
        <div className="container mb-5" style={{marginTop: '20px'}}>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading concerts...</p>
            </div>
          ) : filteredConcerts.length === 0 ? (
            <div className="alert alert-info text-center py-5">
              <p className="mb-0">No concerts found.</p>
            </div>
          ) : (
            <>
              <p className="text-muted mb-4">
                Showing <strong>{filteredConcerts.length}</strong> concert{filteredConcerts.length !== 1 ? "s" : ""}
              </p>
              <div className="row g-0">
                {filteredConcerts.map((concert) => (
                  <div key={concert.id} style={{ flex: '0 0 20%', maxWidth: '20%', padding: '0 0.25rem', marginBottom: '1.5rem' }}>
                    <div className="travel-card">
                      <div className="travel-image-wrapper">
                        <img 
                          src={concert.imageUrl} 
                          alt={concert.title}
                          className="travel-image"
                        />
                        <div className="travel-overlay">
                          <div className="overlay-content">
                            <button 
                              className="book-btn"
                              onClick={() => navigate(`/booking/concert/${concert.id}`)}
                            >
                              Book Now
                            </button>
                          </div>
                        </div>
                        {concert.rating && (
                          <div className="rating-badge">
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="#fbbf24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            <span>{concert.rating}/10</span>
                          </div>
                        )}
                      </div>
                      <div className="travel-info">
                        <h3 className="travel-title">{concert.title}</h3>
                        <div className="travel-meta">
                          <span className="service-type">{concert.genres?.[0] || 'Concert'}</span>
                        </div>
                        <div className="travel-timing">
                          {concert.description}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Concerts;
