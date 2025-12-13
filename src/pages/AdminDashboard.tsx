import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, getEvents } from '../utils/api';
import EventForm from '../components/admin/EventForm';
import TravelForm from '../components/admin/TravelForm';
import '../styles/admin.css';

interface Stats {
    totalBookings: number;
    totalRevenue: number;
    totalEvents: number;
    totalMovies: number;
}

interface Event {
    id?: number;
    title: string;
    description: string;
    eventDate: string;
    location: string;
    price: number;
    seats: number;
    imageUrl: string;
    category: string;
}

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'movies' | 'travel' | 'bookings'>('overview');
    const [stats, setStats] = useState<Stats>({
        totalBookings: 0,
        totalRevenue: 0,
        totalEvents: 0,
        totalMovies: 0
    });
    const [events, setEvents] = useState<Event[]>([]);
    const [travels, setTravels] = useState<any[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [showEventForm, setShowEventForm] = useState(false);
    const [showTravelForm, setShowTravelForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [editingTravel, setEditingTravel] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Check if admin is logged in
        const adminAuth = localStorage.getItem('admin_auth');
        if (!adminAuth) {
            navigate('/admin/login');
            return;
        }

        // Load initial data
        loadStats();
        loadEvents();
    }, [navigate]);

    const loadStats = async () => {
        try {
            const data = await adminAPI.getStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    };

    const loadEvents = async () => {
        try {
            const data = await getEvents();
            setEvents(data);
        } catch (error) {
            console.error('Failed to load events:', error);
        }
    };

    const loadBookings = async () => {
        try {
            const data = await adminAPI.getAllBookings();
            setBookings(data);
        } catch (error) {
            console.error('Failed to load bookings:', error);
        }
    };

    const handleSaveEvent = async (event: Event) => {
        setLoading(true);
        try {
            if (event.id) {
                // Update existing event
                await adminAPI.updateEvent(event.id, event);
                alert('Event updated successfully!');
            } else {
                // Create new event
                await adminAPI.createEvent(event);
                alert('Event created successfully!');
            }
            setShowEventForm(false);
            setEditingEvent(null);
            loadEvents();
            loadStats();
        } catch (error) {
            alert('Failed to save event. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEvent = async (id: number) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        setLoading(true);
        try {
            await adminAPI.deleteEvent(id);
            alert('Event deleted successfully!');
            loadEvents();
            loadStats();
        } catch (error) {
            alert('Failed to delete event. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const loadTravels = async () => {
        try {
            const data = await adminAPI.getAllTravels();
            setTravels(data);
        } catch (error) {
            console.error('Failed to load travels:', error);
        }
    };

    const handleSaveTravel = async (travel: any) => {
        setLoading(true);
        try {
            if (travel.id) {
                await adminAPI.updateTravel(travel.id, travel);
                alert('Travel updated successfully!');
            } else {
                await adminAPI.createTravel(travel);
                alert('Travel created successfully!');
            }
            setShowTravelForm(false);
            setEditingTravel(null);
            loadTravels();
            loadStats();
        } catch (error) {
            alert('Failed to save travel. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTravel = async (id: number) => {
        if (!confirm('Are you sure you want to delete this travel option?')) return;

        setLoading(true);
        try {
            await adminAPI.deleteTravel(id);
            alert('Travel deleted successfully!');
            loadTravels();
            loadStats();
        } catch (error) {
            alert('Failed to delete travel. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_auth');
        navigate('/admin/login');
    };

    // Load data when tabs are active
    useEffect(() => {
        if (activeTab === 'bookings') {
            loadBookings();
        } else if (activeTab === 'travel') {
            loadTravels();
        }
    }, [activeTab]);

    return (
        <div className="admin-dashboard">
            {/* Header */}
            <div className="admin-header">
                <div className="admin-header-content">
                    <h1>🎫 RevTickets Admin</h1>
                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="admin-tabs">
                <button
                    className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    📊 Overview
                </button>
                <button
                    className={`admin-tab ${activeTab === 'events' ? 'active' : ''}`}
                    onClick={() => setActiveTab('events')}
                >
                    🎵 Events
                </button>
                <button
                    className={`admin-tab ${activeTab === 'movies' ? 'active' : ''}`}
                    onClick={() => setActiveTab('movies')}
                >
                    🎬 Movies
                </button>
                <button
                    className={`admin-tab ${activeTab === 'travel' ? 'active' : ''}`}
                    onClick={() => setActiveTab('travel')}
                >
                    ✈️ Travel
                </button>
                <button
                    className={`admin-tab ${activeTab === 'bookings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('bookings')}
                >
                    📋 Bookings
                </button>
            </div>

            {/* Content */}
            <div className="admin-content">
                {activeTab === 'overview' && (
                    <div className="overview-section">
                        <h2>Dashboard Overview</h2>

                        {/* Stats Cards */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">📋</div>
                                <div className="stat-info">
                                    <div className="stat-value">{stats.totalBookings}</div>
                                    <div className="stat-label">Total Bookings</div>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">💰</div>
                                <div className="stat-info">
                                    <div className="stat-value">₹{stats.totalRevenue.toLocaleString()}</div>
                                    <div className="stat-label">Total Revenue</div>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">🎵</div>
                                <div className="stat-info">
                                    <div className="stat-value">{stats.totalEvents}</div>
                                    <div className="stat-label">Total Events</div>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">🎬</div>
                                <div className="stat-info">
                                    <div className="stat-value">{stats.totalMovies}</div>
                                    <div className="stat-label">Total Shows</div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="recent-activity">
                            <h3>Recent Activity</h3>
                            <div className="activity-list">
                                <div className="activity-item">
                                    <span className="activity-icon">✅</span>
                                    <span className="activity-text">Admin dashboard connected to backend</span>
                                    <span className="activity-time">Just now</span>
                                </div>
                                <div className="activity-item">
                                    <span className="activity-icon">📊</span>
                                    <span className="activity-text">Real-time stats are now live</span>
                                    <span className="activity-time">Just now</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'events' && (
                    <div className="manage-section">
                        <div className="section-header">
                            <h2>Manage Events</h2>
                            {!showEventForm && (
                                <button className="add-btn" onClick={() => {
                                    setShowEventForm(true);
                                    setEditingEvent(null);
                                }}>
                                    + Add New Event
                                </button>
                            )}
                        </div>

                        {showEventForm ? (
                            <div className="form-container">
                                <EventForm
                                    event={editingEvent || undefined}
                                    onSave={handleSaveEvent}
                                    onCancel={() => {
                                        setShowEventForm(false);
                                        setEditingEvent(null);
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="events-list">
                                {events.length === 0 ? (
                                    <p className="empty-state">No events yet. Click "Add New Event" to create one.</p>
                                ) : (
                                    <div className="table-container">
                                        <table className="admin-table">
                                            <thead>
                                                <tr>
                                                    <th>Image</th>
                                                    <th>Title</th>
                                                    <th>Category</th>
                                                    <th>Price</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {events.map((event) => (
                                                    <tr key={event.id}>
                                                        <td>
                                                            <img src={event.imageUrl} alt={event.title} className="table-image" />
                                                        </td>
                                                        <td>{event.title}</td>
                                                        <td><span className="category-badge">{event.category}</span></td>
                                                        <td>₹{event.price}</td>
                                                        <td>
                                                            <div className="action-buttons">
                                                                <button
                                                                    className="btn-edit"
                                                                    onClick={() => {
                                                                        setEditingEvent(event);
                                                                        setShowEventForm(true);
                                                                    }}
                                                                    disabled={loading}
                                                                >
                                                                    ✏️ Edit
                                                                </button>
                                                                <button
                                                                    className="btn-delete"
                                                                    onClick={() => handleDeleteEvent(event.id!)}
                                                                    disabled={loading}
                                                                >
                                                                    🗑️ Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'movies' && (
                    <div className="manage-section">
                        <div className="section-header">
                            <h2>Manage Movies</h2>
                            <button className="add-btn">+ Add New Movie</button>
                        </div>
                        <p className="coming-soon">Movie management coming soon...</p>
                    </div>
                )}

                {activeTab === 'travel' && (
                    <div className="manage-section">
                        <div className="section-header">
                            <h2>Manage Travel</h2>
                            {!showTravelForm && (
                                <button className="add-btn" onClick={() => {
                                    setShowTravelForm(true);
                                    setEditingTravel(null);
                                }}>
                                    + Add New Travel Option
                                </button>
                            )}
                        </div>

                        {showTravelForm ? (
                            <div className="form-container">
                                <TravelForm
                                    travel={editingTravel || undefined}
                                    onSave={handleSaveTravel}
                                    onCancel={() => {
                                        setShowTravelForm(false);
                                        setEditingTravel(null);
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="travels-list">
                                {travels.length === 0 ? (
                                    <p className="empty-state">No travel options yet. Click "Add New Travel Option" to create one.</p>
                                ) : (
                                    <div className="table-container">
                                        <table className="admin-table">
                                            <thead>
                                                <tr>
                                                    <th>Type</th>
                                                    <th>Operator</th>
                                                    <th>Route</th>
                                                    <th>Time</th>
                                                    <th>Price</th>
                                                    <th>Seats</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {travels.map((travel) => (
                                                    <tr key={travel.id}>
                                                        <td><span className="category-badge">{travel.type}</span></td>
                                                        <td>{travel.operator}</td>
                                                        <td>{travel.departure} → {travel.arrival}</td>
                                                        <td>{travel.departureTime}</td>
                                                        <td>₹{travel.price}</td>
                                                        <td>{travel.availableSeats}</td>
                                                        <td>
                                                            <div className="action-buttons">
                                                                <button
                                                                    className="btn-edit"
                                                                    onClick={() => {
                                                                        setEditingTravel(travel);
                                                                        setShowTravelForm(true);
                                                                    }}
                                                                    disabled={loading}
                                                                >
                                                                    ✏️ Edit
                                                                </button>
                                                                <button
                                                                    className="btn-delete"
                                                                    onClick={() => handleDeleteTravel(travel.id)}
                                                                    disabled={loading}
                                                                >
                                                                    🗑️ Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'bookings' && (
                    <div className="manage-section">
                        <h2>All Bookings</h2>
                        {bookings.length === 0 ? (
                            <p className="empty-state">No bookings yet.</p>
                        ) : (
                            <div className="table-container">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Booking ID</th>
                                            <th>User ID</th>
                                            <th>Seats</th>
                                            <th>Total Price</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.map((booking) => (
                                            <tr key={booking.id}>
                                                <td>#{booking.id}</td>
                                                <td>{booking.user?.id || 'N/A'}</td>
                                                <td>{booking.seats?.join(', ') || 'N/A'}</td>
                                                <td>₹{booking.totalPrice}</td>
                                                <td><span className="status-badge">{booking.status}</span></td>
                                                <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
