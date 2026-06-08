import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav style={{ background: '#4f46e5', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/dashboard" style={{ color: 'white', fontWeight: 700, fontSize: '18px', textDecoration: 'none' }}>
          🎫 SupportDesk
        </Link>
        <Link to="/tickets" style={{ color: '#c7d2fe', textDecoration: 'none', fontSize: '14px' }}>My Tickets</Link>
        {user?.role === 'admin' && (
          <Link to="/admin" style={{ color: '#c7d2fe', textDecoration: 'none', fontSize: '14px' }}>Admin Panel</Link>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ color: '#e0e7ff', fontSize: '14px' }}>👤 {user?.name} ({user?.role})</span>
        <button onClick={handleLogout} className="btn btn-danger" style={{ fontSize: '13px', padding: '6px 14px' }}>Logout</button>
      </div>
    </nav>
  );
}