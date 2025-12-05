import AppRoutes from "./routes/AppRoutes";
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

        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
