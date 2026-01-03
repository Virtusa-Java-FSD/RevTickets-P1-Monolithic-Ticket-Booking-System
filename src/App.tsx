import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Sidebar from "./components/Sidebar";
import ConnectionStatus from "./components/ConnectionStatus";
import { AuthProvider } from "./context/AuthContext";
import RevHelp from "./components/RevHelp";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Sidebar />}
      <main className={isAdminRoute ? "admin-main" : "app-main"}>
        <AppRoutes />
      </main>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="app-root">
        <ConnectionStatus />
        <RevHelp />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
