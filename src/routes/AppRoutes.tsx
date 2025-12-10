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
import Booking from "../pages/Booking";
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
    <Route path="/booking/event/:eventId" element={<Booking />} />
    <Route path="/concerts" element={<Concerts />} />
    <Route path="/travels" element={<Travels />} />
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
