import { Routes, Route, Navigate } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <>
      <Navbar />
      <main className="app-main">
        <AppRoutes />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="app-root">
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
