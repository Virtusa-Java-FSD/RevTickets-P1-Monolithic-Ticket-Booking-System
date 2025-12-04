import { useState, useEffect } from "react";

const Travels = () => {
  const [activeTab, setActiveTab] = useState("flights");
  const [showResults, setShowResults] = useState(false);
  const [searchData, setSearchData] = useState({ from: '', to: '', date: '', passengers: '1' });

  useEffect(() => {
    document.body.classList.add('travel-page');
    return () => document.body.classList.remove('travel-page');
  }, []);

  return (
    <div className="container mt-4 travel-container">
      <h2 className="mb-4">Travel Booking</h2>
      
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === "flights" ? "active" : ""}`}
            onClick={() => setActiveTab("flights")}
          >
            ✈️ Flights
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === "buses" ? "active" : ""}`}
            onClick={() => setActiveTab("buses")}
          >
            🚌 Buses
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === "trains" ? "active" : ""}`}
            onClick={() => setActiveTab("trains")}
          >
            🚆 Trains
          </button>
        </li>
      </ul>

      <div className="tab-content">
        {activeTab === "flights" && (
          <div className="card p-4 travel-card">
            <h4>Flight Booking</h4>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">From</label>
                <input type="text" className="form-control" placeholder="Departure city" />
              </div>
              <div className="col-md-6">
                <label className="form-label">To</label>
                <input type="text" className="form-control" placeholder="Destination city" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Departure Date</label>
                <input type="date" className="form-control" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Passengers</label>
                <select className="form-control">
                  <option>1 Passenger</option>
                  <option>2 Passengers</option>
                  <option>3 Passengers</option>
                  <option>4+ Passengers</option>
                </select>
              </div>
              <div className="col-12">
                <button className="btn btn-primary" onClick={() => setShowResults(true)}>Search Flights</button>
              </div>
            </div>
            
            {showResults && (
              <div className="mt-4 travel-results">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5>Available Flights</h5>
                  <div className="d-flex gap-2">
                    <select className="form-select form-select-sm" style={{width: 'auto'}}>
                      <option>Sort by Price</option>
                      <option>Sort by Duration</option>
                      <option>Sort by Departure</option>
                    </select>
                  </div>
                </div>
                
                <div className="row">
                  {[1,2,3].map(i => (
                    <div key={i} className="col-12 mb-3">
                      <div className="card">
                        <div className="card-body">
                          <div className="row align-items-center">
                            <div className="col-md-3">
                              <h6 className="mb-1">IndiGo 6E-{123+i}</h6>
                              <small className="text-muted">Airbus A320</small>
                            </div>
                            <div className="col-md-4">
                              <div className="d-flex align-items-center">
                                <div className="text-center">
                                  <div className="fw-bold">08:{30+i*2}0</div>
                                  <small>DEL</small>
                                </div>
                                <div className="mx-3 flex-grow-1">
                                  <div className="border-top position-relative">
                                    <small className="position-absolute top-50 start-50 translate-middle bg-white px-2 text-muted">{i+1}h {20+i*10}m</small>
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="fw-bold">{10+i*2}:{50-i*5}0</div>
                                  <small>BOM</small>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-2 text-center">
                              <div className="fw-bold text-success">₹{4500+i*500}</div>
                              <small className="text-muted">per person</small>
                            </div>
                            <div className="col-md-3 text-end">
                              <button className="btn btn-outline-primary btn-sm me-2">View Details</button>
                              <button className="btn btn-primary btn-sm">Book Now</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "buses" && (
          <div className="card p-4 travel-card">
            <h4>Bus Booking</h4>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">From</label>
                <input type="text" className="form-control" placeholder="Departure city" />
              </div>
              <div className="col-md-6">
                <label className="form-label">To</label>
                <input type="text" className="form-control" placeholder="Destination city" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Travel Date</label>
                <input type="date" className="form-control" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Passengers</label>
                <select className="form-control">
                  <option>1 Passenger</option>
                  <option>2 Passengers</option>
                  <option>3 Passengers</option>
                  <option>4+ Passengers</option>
                </select>
              </div>
              <div className="col-12">
                <button className="btn btn-primary" onClick={() => setShowResults(true)}>Search Buses</button>
              </div>
            </div>
            
            {showResults && (
              <div className="mt-4 travel-results">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5>Available Buses</h5>
                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-secondary btn-sm">AC</button>
                    <button className="btn btn-outline-secondary btn-sm">Non-AC</button>
                    <button className="btn btn-outline-secondary btn-sm">Sleeper</button>
                  </div>
                </div>
                
                <div className="row">
                  {[1,2,3].map(i => (
                    <div key={i} className="col-12 mb-3">
                      <div className="card">
                        <div className="card-body">
                          <div className="row align-items-center">
                            <div className="col-md-3">
                              <h6 className="mb-1">{['VRL Travels', 'SRS Travels', 'Orange Travels'][i-1]}</h6>
                              <small className="text-muted">{['AC Sleeper', 'AC Semi Sleeper', 'Non-AC Seater'][i-1]}</small>
                            </div>
                            <div className="col-md-4">
                              <div className="d-flex align-items-center">
                                <div className="text-center">
                                  <div className="fw-bold">{20+i}:00</div>
                                  <small>Departure</small>
                                </div>
                                <div className="mx-3 flex-grow-1">
                                  <div className="border-top position-relative">
                                    <small className="position-absolute top-50 start-50 translate-middle bg-white px-2 text-muted">{6+i}h {30-i*10}m</small>
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="fw-bold">0{2+i}:{30+i*15}</div>
                                  <small>Arrival</small>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-2 text-center">
                              <div className="fw-bold text-success">₹{800+i*200}</div>
                              <small className="text-muted">per seat</small>
                            </div>
                            <div className="col-md-3 text-end">
                              <button className="btn btn-outline-primary btn-sm me-2">View Seats</button>
                              <button className="btn btn-primary btn-sm">Book Now</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "trains" && (
          <div className="card p-4 travel-card">
            <h4>Train Booking</h4>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">From</label>
                <input type="text" className="form-control" placeholder="Departure station" />
              </div>
              <div className="col-md-6">
                <label className="form-label">To</label>
                <input type="text" className="form-control" placeholder="Destination station" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Travel Date</label>
                <input type="date" className="form-control" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Class</label>
                <select className="form-control">
                  <option>Sleeper</option>
                  <option>AC 3 Tier</option>
                  <option>AC 2 Tier</option>
                  <option>AC 1 Tier</option>
                </select>
              </div>
              <div className="col-12">
                <button className="btn btn-primary" onClick={() => setShowResults(true)}>Search Trains</button>
              </div>
            </div>
            
            {showResults && (
              <div className="mt-4 travel-results">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5>Available Trains</h5>
                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-secondary btn-sm">Availability</button>
                    <button className="btn btn-outline-secondary btn-sm">Duration</button>
                  </div>
                </div>
                
                <div className="row">
                  {[1,2,3].map(i => (
                    <div key={i} className="col-12 mb-3">
                      <div className="card">
                        <div className="card-body">
                          <div className="row align-items-center">
                            <div className="col-md-3">
                              <h6 className="mb-1">{['Rajdhani Exp', 'Shatabdi Exp', 'Duronto Exp'][i-1]}</h6>
                              <small className="text-muted">#{12001+i*10}</small>
                            </div>
                            <div className="col-md-4">
                              <div className="d-flex align-items-center">
                                <div className="text-center">
                                  <div className="fw-bold">{15+i}:{45-i*5}</div>
                                  <small>NDLS</small>
                                </div>
                                <div className="mx-3 flex-grow-1">
                                  <div className="border-top position-relative">
                                    <small className="position-absolute top-50 start-50 translate-middle bg-white px-2 text-muted">{14+i*2}h {25+i*5}m</small>
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="fw-bold">0{6+i}:{10+i*15}</div>
                                  <small>CSTM</small>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-2">
                              <div className="small">
                                <div>SL: ₹{450+i*50} <span className="text-success">Available</span></div>
                                <div>3A: ₹{1200+i*100} <span className="text-warning">RAC</span></div>
                              </div>
                            </div>
                            <div className="col-md-3 text-end">
                              <button className="btn btn-outline-primary btn-sm me-2">Check Availability</button>
                              <button className="btn btn-primary btn-sm">Book Now</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Travels;
