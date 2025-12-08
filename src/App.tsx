import AppRoutes from "./routes/AppRoutes";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <AuthProvider>
      <div className="app-root">
        <BrowserRouter>
          <Navbar />
          <main className="app-main">
            <AppRoutes />
          </main>
          <Footer />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
