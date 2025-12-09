import { Routes, Route, Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Movies from "../pages/Movies";
import MovieDetail from "../pages/MovieDetail";
import Events from "../pages/Events";
import Concerts from "../pages/Concerts";
import Travels from "../pages/Travels";
import Dashboard from "../pages/Dashboard";
import BookingDetails from "../pages/BookingDetails";
import BookingSummary from "../pages/BookingSummary";
import BusSeatSelection from "../components/BusSeatSelection";
import TrainClassSelection from "../components/TrainClassSelection";
import { useAuth } from "../context/AuthContext";

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
    <Route path="/movies" element={<Movies />} />
    <Route path="/movies/:movieId" element={<MovieDetail />} />
    <Route path="/events" element={<Events />} />
    <Route path="/concerts" element={<Concerts />} />
    <Route path="/travels" element={<Travels />} />
    <Route path="/bus-seat-selection" element={<BusSeatSelection />} />
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
  </Routes>
);

export default AppRoutes;
