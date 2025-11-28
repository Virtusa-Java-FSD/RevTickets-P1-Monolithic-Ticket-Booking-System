import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Movies from "../pages/Movies";
import Events from "../pages/Events";
import Concerts from "../pages/Concerts";
import Travels from "../pages/Travels";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/events" element={<Events />} />
      <Route path="/concerts" element={<Concerts />} />
      <Route path="/travels" element={<Travels />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
