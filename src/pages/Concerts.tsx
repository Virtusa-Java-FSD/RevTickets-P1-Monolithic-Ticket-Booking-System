import { useState, useEffect } from "react";
import type { Event } from "../types/Event";

const Concerts = () => {
  const [concerts, setConcerts] = useState<Event[]>([]);
  const [filteredConcerts, setFilteredConcerts] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadConcerts();
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
        },
        {
          id: "c2",
          title: "Coldplay Music of the Spheres",
          description: "Coldplay's spectacular world tour with stunning visuals",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=300&h=400&fit=crop",
          rating: 9.5,
        },
        {
          id: "c3",
          title: "AR Rahman Live",
          description: "The Mozart of Madras performs his greatest hits",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=400&fit=crop",
          rating: 9.0,
        },
        {
          id: "c4",
          title: "Arijit Singh Concert",
          description: "Bollywood's favorite voice live in concert",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=400&fit=crop",
          rating: 8.8,
        },
        {
          id: "c5",
          title: "Imagine Dragons Evolve Tour",
          description: "Rock the night with Imagine Dragons",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&h=400&fit=crop",
          rating: 8.9,
        },
        {
          id: "c6",
          title: "Dua Lipa Future Nostalgia",
          description: "Pop sensation Dua Lipa's electrifying performance",
          category: "concert",
          imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&h=400&fit=crop",
          rating: 8.7,
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
    if (searchTerm.trim()) {
      result = result.filter(
        (concert) =>
          concert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          concert.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredConcerts(result);
  }, [searchTerm, concerts]);

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading concerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="concerts-page">
      <div className="container-fluid">
        <div className="concerts-header py-5 bg-dark text-white">
          <div className="container">
            <h1 className="display-4 mb-2">🎵 Concerts</h1>
            <p className="lead">Book tickets for amazing live concerts!</p>
          </div>
        </div>

        <div className="container mt-4 mb-5">
          <div className="row g-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="🔍 Search concerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="container mb-5">
          {filteredConcerts.length === 0 ? (
            <div className="alert alert-info text-center py-5">
              <p className="mb-0">No concerts found.</p>
            </div>
          ) : (
            <>
              <p className="text-muted mb-4">
                Showing <strong>{filteredConcerts.length}</strong> concert{filteredConcerts.length !== 1 ? "s" : ""}
              </p>
              <div className="row g-4">
                {filteredConcerts.map((concert) => (
                  <div key={concert.id} className="col-sm-6 col-md-4 col-lg-3">
                    <div className="card h-100 shadow-sm">
                      <img
                        src={concert.imageUrl}
                        className="card-img-top"
                        alt={concert.title}
                        style={{ height: "300px", objectFit: "cover" }}
                        onError={(e) => {
                          e.currentTarget.src = `https://picsum.photos/300/400?random=${concert.id}`;
                        }}
                      />
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{concert.title}</h5>
                        <p className="card-text text-muted small flex-grow-1">
                          {concert.description}
                        </p>
                        {concert.rating && (
                          <div className="mb-2">
                            <span className="badge bg-warning text-dark">
                              ⭐ {concert.rating}
                            </span>
                          </div>
                        )}
                        <button className="btn btn-primary">
                          Book Now
                        </button>
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
