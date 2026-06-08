import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import TicketList from './pages/tickets/TicketList';
import TicketDetail from './pages/tickets/TicketDetail';
import AdminPanel from './pages/admin/AdminPanel';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login"/>;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user?.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

function AppRoutes() {
  const { token } = useAuth();
  return (
    <>
      {token && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/tickets" element={<PrivateRoute><TicketList /></PrivateRoute>} />
        <Route path="/tickets/:id" element={<PrivateRoute><TicketDetail /></PrivateRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}