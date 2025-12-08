import { useState } from "react";

const Travels = () => {
  const [activeTab, setActiveTab] = useState("flights");

  return (
    <div className="container mt-4">
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
          <div className="card p-4">
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
                <button className="btn btn-primary">Search Flights</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "buses" && (
          <div className="card p-4">
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
                <button className="btn btn-primary">Search Buses</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "trains" && (
          <div className="card p-4">
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
                <button className="btn btn-primary">Search Trains</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Travels;
