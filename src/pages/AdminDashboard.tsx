import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI, getEvents } from '../utils/api';
import EventForm from '../components/admin/EventForm';
import TravelForm from '../components/admin/TravelForm';
import MovieForm from '../components/admin/MovieForm';
import UserForm from '../components/admin/UserForm';
import TheaterForm from '../components/admin/TheaterForm';
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
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'movies' | 'travel' | 'bookings' | 'users' | 'theaters'>('overview');
    const [stats, setStats] = useState<Stats>({
        totalBookings: 0,
        totalRevenue: 0,
        totalEvents: 0,
        totalMovies: 0
    });
    const [events, setEvents] = useState<Event[]>([]);
    const [movies, setMovies] = useState<any[]>([]);
    const [travels, setTravels] = useState<any[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [theaters, setTheaters] = useState<any[]>([]);
    const [showEventForm, setShowEventForm] = useState(false);
    const [showMovieForm, setShowMovieForm] = useState(false);
    const [showTravelForm, setShowTravelForm] = useState(false);
    const [showUserForm, setShowUserForm] = useState(false);
    const [showTheaterForm, setShowTheaterForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [editingMovie, setEditingMovie] = useState<any | null>(null);
    const [editingTravel, setEditingTravel] = useState<any | null>(null);
    const [editingUser, setEditingUser] = useState<any | null>(null);
    const [editingTheater, setEditingTheater] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const authData = localStorage.getItem('rev_auth');
        if (!authData) {
            navigate('/login');
            return;
        }
        
        try {
            const { user } = JSON.parse(authData);
            if (!user || user.role !== 'ADMIN') {
                navigate('/');
                return;
            }
        } catch (error) {
            navigate('/login');
            return;
        }

        loadStats();
        loadEvents();
        loadMovies();
        loadTheaters();
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
            const eventsList = Array.isArray(data) ? data.filter((e: any) => 
                e.category !== 'movie' && e.category !== 'travel'
            ) : [];
            setEvents(eventsList);
        } catch (error) {
            console.error('Failed to load events:', error);
        }
    };

    const loadMovies = async () => {
        try {
            const data = await adminAPI.getAllMovies();
            setMovies(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to load movies:', error);
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
                await adminAPI.updateEvent(event.id, event);
                alert('Event updated successfully!');
            } else {
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

    const handleSaveMovie = async (movie: any) => {
        setLoading(true);
        try {
            const movieData = {
                title: movie.title?.trim(),
                description: movie.description?.trim(),
                category: 'movie',
                imageUrl: movie.imageUrl?.trim(),
                rating: movie.rating || 0,
                genre: movie.genre?.trim() || '',
                duration: movie.duration || 0,
                releaseDate: movie.releaseDate || '',
                language: movie.language || 'English',
                format: movie.format || '2D',
                price: movie.price || 0,
                isNewRelease: movie.isNewRelease || false
            };

            if (!movieData.title || !movieData.description || !movieData.imageUrl) {
                alert('Please fill in all required fields (Title, Description, Image URL)');
                setLoading(false);
                return;
            }

            if (movie.id) {
                await adminAPI.updateMovie(movie.id, movieData);
                alert('Movie updated successfully!');
            } else {
                await adminAPI.createMovie(movieData);
                alert('Movie created successfully!');
            }
            setShowMovieForm(false);
            setEditingMovie(null);
            loadMovies();
            loadStats();
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to save movie. Please try again.';
            alert(errorMessage);
            console.error('Movie save error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMovie = async (id: number) => {
        if (!confirm('Are you sure you want to delete this movie?')) return;

        setLoading(true);
        try {
            await adminAPI.deleteMovie(id);
            alert('Movie deleted successfully!');
            loadMovies();
            loadStats();
        } catch (error) {
            alert('Failed to delete movie. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegenerateShows = async (movieId: number) => {
        if (!confirm('This will delete existing shows and create new ones for all active theaters. Continue?')) return;

        setLoading(true);
        try {
            const response = await adminAPI.createShowsForEvent(movieId);
            const theaters = response.theaters || [];
            alert(`Shows regenerated successfully!\n\nTotal Shows: ${response.totalShows || 'N/A'}\nTheaters: ${theaters.join(', ')}`);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to regenerate shows. Please try again.';
            alert(errorMessage);
            console.error('Regenerate shows error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckShows = async (movieId: number) => {
        setLoading(true);
        try {
            const info = await adminAPI.getShowsInfo(movieId);
            const message = `Shows Info for "${info.eventTitle}":\n\n` +
                `Total Shows: ${info.totalShows}\n\n` +
                `Theaters in Shows:\n${info.theatersInShows.join('\n')}\n\n` +
                `All Active Theaters:\n${info.allActiveTheaters.join('\n')}`;
            alert(message);
        } catch (error: any) {
            alert('Failed to get shows info: ' + (error.response?.data?.error || error.message));
            console.error('Check shows error:', error);
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
        logout();
    };

    const loadUsers = async () => {
        try {
            const data = await adminAPI.getAllUsers();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to load users:', error);
        }
    };

    const handleSaveUser = async (user: any) => {
        setLoading(true);
        try {
            if (user.id) {
                await adminAPI.updateUser(user.id, user);
                alert('User updated successfully!');
            } else {
                alert('User creation not supported through admin panel. Users must register.');
                return;
            }
            setShowUserForm(false);
            setEditingUser(null);
            loadUsers();
            loadStats();
        } catch (error) {
            alert('Failed to save user. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

        setLoading(true);
        try {
            await adminAPI.deleteUser(id);
            alert('User deleted successfully!');
            loadUsers();
            loadStats();
        } catch (error) {
            alert('Failed to delete user. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChangeUserRole = async (userId: number, newRole: string) => {
        if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

        setLoading(true);
        try {
            await adminAPI.changeUserRole(userId, newRole);
            alert(`User role changed to ${newRole} successfully!`);
            loadUsers();
        } catch (error) {
            alert('Failed to change user role. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const loadTheaters = async () => {
        try {
            const data = await adminAPI.getAllTheaters();
            setTheaters(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to load theaters:', error);
        }
    };

    const handleSaveTheater = async (theater: any) => {
        setLoading(true);
        try {
            if (!theater.location && theater.city && theater.state) {
                theater.location = `${theater.city}, ${theater.state}`;
            }
            if (theater.isActive === undefined || theater.isActive === null) {
                theater.isActive = true;
            }
            if (theater.id) {
                await adminAPI.updateTheater(theater.id, theater);
                alert('Theater updated successfully!');
            } else {
                await adminAPI.createTheater(theater);
                alert('Theater created successfully!');
            }
            setShowTheaterForm(false);
            setEditingTheater(null);
            loadTheaters();
        } catch (error) {
            alert('Failed to save theater. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTheater = async (id: number) => {
        if (!confirm('Are you sure you want to delete this theater?')) return;

        setLoading(true);
        try {
            await adminAPI.deleteTheater(id);
            alert('Theater deleted successfully!');
            loadTheaters();
        } catch (error) {
            alert('Failed to delete theater. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'bookings') {
            loadBookings();
        } else if (activeTab === 'travel') {
            loadTravels();
        } else if (activeTab === 'movies') {
            loadMovies();
        } else if (activeTab === 'users') {
            loadUsers();
        } else if (activeTab === 'theaters') {
            loadTheaters();
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
                <button
                    className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    👥 Users
                </button>
                <button
                    className={`admin-tab ${activeTab === 'theaters' ? 'active' : ''}`}
                    onClick={() => setActiveTab('theaters')}
                >
                    🎭 Theaters
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
                            {!showMovieForm && (
                                <button className="add-btn" onClick={() => {
                                    setShowMovieForm(true);
                                    setEditingMovie(null);
                                }}>
                                    + Add New Movie
                                </button>
                            )}
                        </div>

                        {showMovieForm ? (
                            <div className="form-container">
                                <MovieForm
                                    movie={editingMovie || undefined}
                                    onSave={handleSaveMovie}
                                    onCancel={() => {
                                        setShowMovieForm(false);
                                        setEditingMovie(null);
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="movies-list">
                                {movies.length === 0 ? (
                                    <p className="empty-state">No movies yet. Click "Add New Movie" to create one.</p>
                                ) : (
                                    <div className="table-container">
                                        <table className="admin-table">
                                            <thead>
                                                <tr>
                                                    <th>Image</th>
                                                    <th>Title</th>
                                                    <th>Language</th>
                                                    <th>Genre</th>
                                                    <th>Rating</th>
                                                    <th>Price</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {movies.map((movie) => (
                                                    <tr key={movie.id}>
                                                        <td>
                                                            <img src={movie.imageUrl} alt={movie.title} className="table-image" />
                                                        </td>
                                                        <td>{movie.title}</td>
                                                        <td>{movie.language || 'N/A'}</td>
                                                        <td><span className="category-badge">{movie.genre || 'N/A'}</span></td>
                                                        <td>⭐ {movie.rating || 'N/A'}</td>
                                                        <td>₹{movie.price || 'N/A'}</td>
                                                        <td>
                                                            <div className="action-buttons">
                                                                <button
                                                                    className="btn-edit"
                                                                    onClick={() => {
                                                                        setEditingMovie(movie);
                                                                        setShowMovieForm(true);
                                                                    }}
                                                                    disabled={loading}
                                                                >
                                                                    ✏️ Edit
                                                                </button>
                                                                <button
                                                                    className="btn-edit"
                                                                    onClick={() => handleRegenerateShows(movie.id)}
                                                                    disabled={loading}
                                                                    title="Regenerate shows for all theaters"
                                                                >
                                                                    🎭 Regenerate Shows
                                                                </button>
                                                                <button
                                                                    className="btn-edit"
                                                                    onClick={() => handleCheckShows(movie.id)}
                                                                    disabled={loading}
                                                                    title="Check which theaters are in shows"
                                                                >
                                                                    🔍 Check Shows
                                                                </button>
                                                                <button
                                                                    className="btn-delete"
                                                                    onClick={() => handleDeleteMovie(movie.id)}
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

                {activeTab === 'users' && (
                    <div className="manage-section">
                        <div className="section-header">
                            <h2>Manage Users</h2>
                            {!showUserForm && (
                                <button className="add-btn" onClick={() => {
                                    setShowUserForm(true);
                                    setEditingUser(null);
                                }}>
                                    + Add New User
                                </button>
                            )}
                        </div>

                        {showUserForm ? (
                            <div className="form-container">
                                <UserForm
                                    user={editingUser || undefined}
                                    onSave={handleSaveUser}
                                    onCancel={() => {
                                        setShowUserForm(false);
                                        setEditingUser(null);
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="users-list">
                                {users.length === 0 ? (
                                    <p className="empty-state">No users yet.</p>
                                ) : (
                                    <div className="table-container">
                                        <table className="admin-table">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Phone</th>
                                                    <th>Role</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.map((user) => (
                                                    <tr key={user.id}>
                                                        <td>#{user.id}</td>
                                                        <td>{user.name}</td>
                                                        <td>{user.email}</td>
                                                        <td>{user.phone || 'N/A'}</td>
                                                        <td>
                                                            <span className={`category-badge ${user.role === 'ADMIN' ? 'admin-badge' : ''}`}>
                                                                {user.role || 'USER'}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="action-buttons">
                                                                <button
                                                                    className="btn-edit"
                                                                    onClick={() => {
                                                                        setEditingUser(user);
                                                                        setShowUserForm(true);
                                                                    }}
                                                                    disabled={loading}
                                                                >
                                                                    ✏️ Edit
                                                                </button>
                                                                {user.role !== 'ADMIN' ? (
                                                                    <button
                                                                        className="btn-edit"
                                                                        onClick={() => handleChangeUserRole(user.id, 'ADMIN')}
                                                                        disabled={loading}
                                                                        title="Make Admin"
                                                                    >
                                                                        ⭐ Make Admin
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        className="btn-edit"
                                                                        onClick={() => handleChangeUserRole(user.id, 'USER')}
                                                                        disabled={loading}
                                                                        title="Remove Admin"
                                                                    >
                                                                        👤 Remove Admin
                                                                    </button>
                                                                )}
                                                                <button
                                                                    className="btn-delete"
                                                                    onClick={() => handleDeleteUser(user.id)}
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

                {activeTab === 'theaters' && (
                    <div className="manage-section">
                        <div className="section-header">
                            <h2>Manage Theaters</h2>
                            {!showTheaterForm && (
                                <button className="add-btn" onClick={() => {
                                    setShowTheaterForm(true);
                                    setEditingTheater(null);
                                }}>
                                    + Add New Theater
                                </button>
                            )}
                        </div>

                        {showTheaterForm ? (
                            <div className="form-container">
                                <TheaterForm
                                    theater={editingTheater || undefined}
                                    onSave={handleSaveTheater}
                                    onCancel={() => {
                                        setShowTheaterForm(false);
                                        setEditingTheater(null);
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="theaters-list">
                                {theaters.length === 0 ? (
                                    <p className="empty-state">No theaters yet. Add your first theater!</p>
                                ) : (
                                    <div className="table-container">
                                        <table className="admin-table">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Theater Name</th>
                                                    <th>City</th>
                                                    <th>State</th>
                                                    <th>Location</th>
                                                    <th>Screens</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {theaters.map((theater) => (
                                                    <tr key={theater.id}>
                                                        <td>#{theater.id}</td>
                                                        <td><strong>{theater.name}</strong></td>
                                                        <td>{theater.city || 'N/A'}</td>
                                                        <td>{theater.state || 'N/A'}</td>
                                                        <td>{theater.location || 'N/A'}</td>
                                                        <td>{theater.totalScreens || 0}</td>
                                                        <td>
                                                            <span className={`category-badge ${theater.isActive ? 'active-badge' : 'inactive-badge'}`}>
                                                                {theater.isActive ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="action-buttons">
                                                                <button
                                                                    className="btn-edit"
                                                                    onClick={() => {
                                                                        setEditingTheater(theater);
                                                                        setShowTheaterForm(true);
                                                                    }}
                                                                    disabled={loading}
                                                                >
                                                                    ✏️ Edit
                                                                </button>
                                                                <button
                                                                    className="btn-delete"
                                                                    onClick={() => handleDeleteTheater(theater.id)}
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
            </div>
        </div>
    );
};

export default AdminDashboard;
