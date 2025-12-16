import { Routes, Route, Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ResetPassword from "../pages/ResetPassword";
import Movies from "../pages/Movies";
import MovieDetail from "../pages/MovieDetail";
import SeatSelection from "../pages/SeatSelection";
import Payment from "../pages/Payment";
import Events from "../pages/Events";
import Concerts from "../pages/Concerts";
import ConcertBooking from "../pages/ConcertBooking";
import BookingConfirmation from "../pages/BookingConfirmation";
import Travels from "../pages/Travels";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Booking from "../pages/Booking";
import BookingDetails from "../pages/BookingDetails";
import BookingSummary from "../pages/BookingSummary";
import BusSeatSelection from "../pages/BusSeatSelection";
import BusBoardingDrop from "../pages/BusBoardingDrop";
import BusPassengerInfo from "../pages/BusPassengerInfo";
import BusBookingSummary from "../pages/BusBookingSummary";
import PaymentSuccess from "../pages/PaymentSuccess";
import TrainClassSelection from "../components/TrainClassSelection";
import AdminDashboard from "../pages/AdminDashboard";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/movies" element={<Movies />} />
    <Route path="/movies/:movieId" element={<MovieDetail />} />
    <Route path="/seat-selection/:showId" element={<SeatSelection />} />

    <Route path="/payment" element={<Payment />} />
    <Route path="/events" element={<Events />} />
    <Route path="/booking/event/:eventId" element={<Booking />} />
    <Route path="/concerts" element={<Concerts />} />
    <Route path="/booking/concert/:concertId" element={<ConcertBooking />} />
    <Route path="/booking-confirmation" element={<BookingConfirmation />} />
    <Route path="/travels" element={<Travels />} />
    <Route path="/bus-seat-selection" element={<BusSeatSelection />} />
    <Route path="/bus-boarding-drop" element={<BusBoardingDrop />} />
    <Route path="/bus-passenger-info" element={<BusPassengerInfo />} />
    <Route path="/bus-booking-summary" element={<BusBookingSummary />} />
    <Route path="/payment-success" element={<PaymentSuccess />} />

    <Route path="/train-class-selection" element={<TrainClassSelection />} />
    <Route path="/booking-details" element={<BookingDetails />} />
    <Route path="/booking-summary" element={<BookingSummary />} />
    <Route
      path="/dashboard"
      element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      }
    />
    <Route
      path="/profile"
      element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      }
    />

    {/* Admin Routes - Protected */}
    <Route
      path="/admin/dashboard"
      element={
        <ProtectedRoute requireAdmin={true}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    {/* Redirect old admin login to main login */}
    <Route path="/admin/login" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default AppRoutes;
