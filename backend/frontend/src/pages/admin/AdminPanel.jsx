import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import TicketCard from '../../components/TicketCard';

export default function AdminPanel() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    axiosInstance.get('/tickets').then(res => setTickets(res.data)).catch(() => {});
  }, []);

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    in_progress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
  };

  return (
    <div className="container" style={{ paddingTop: '30px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px' }}>🛠️ Admin Panel</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[['Total', stats.total, '#4f46e5'], ['Open', stats.open, '#3b82f6'], ['In Progress', stats.in_progress, '#f59e0b'], ['Resolved', stats.resolved, '#22c55e']].map(([label, val, color]) => (
          <div key={label} className="card" style={{ textAlign: 'center', borderTop: `3px solid ${color}` }}>
            <div style={{ fontSize: '28px', fontWeight: 700, color }}>{val}</div>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>{label}</div>
          </div>
        ))}
      </div>
      <h2 style={{ marginBottom: '16px' }}>All Tickets</h2>
      {tickets.map(t => <TicketCard key={t.id} ticket={t} />)}
    </div>
  );
}