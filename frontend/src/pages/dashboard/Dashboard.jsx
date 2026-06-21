import { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import TicketForm from '../../components/TicketForm';
import TicketCard from '../../components/TicketCard';

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  const fetchTickets = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/tickets');
      setTickets(res.data);
    } catch { setTickets([]); }
  }, []);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    in_progress: tickets.filter(t => t.status === 'in_progress').length,
    closed: tickets.filter(t => t.status === 'closed').length,
  };

  return (
    <div className="container" style={{ paddingTop: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Welcome, {user?.name} 👋</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Here's your support overview</p>
        </div>
        {user?.role === 'customer' && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '+ New Ticket'}
          </button>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[['Total', stats.total, '#4f46e5'], ['Open', stats.open, '#3b82f6'], ['In Progress', stats.in_progress, '#f59e0b'], ['Closed', stats.closed, '#22c55e']].map(([label, val, color]) => (
          <div key={label} className="card" style={{ textAlign: 'center', borderTop: `3px solid ${color}` }}>
            <div style={{ fontSize: '28px', fontWeight: 700, color }}>{val}</div>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>{label}</div>
          </div>
        ))}
      </div>
      {showForm && <TicketForm onSuccess={() => { setShowForm(false); fetchTickets(); }} />}
      <h2 style={{ marginBottom: '16px', fontSize: '18px' }}>Recent Tickets</h2>
      {tickets.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: '#9ca3af' }}>No tickets yet. Create your first one!</div>
      ) : (tickets.slice(0, 5).map(t => <TicketCard key={t.id} ticket={t} />))}
    </div>
  );
}