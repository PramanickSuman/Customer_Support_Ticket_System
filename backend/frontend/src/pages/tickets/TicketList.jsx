import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import TicketCard from '../../components/TicketCard';

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');

  useEffect(() => { fetchTickets(); }, []);

  useEffect(() => {
    let result = tickets;
    if (status !== 'all') result = result.filter(t => t.status === status);
    if (priority !== 'all') result = result.filter(t => t.priority === priority);
    if (search) result = result.filter(t =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
  }, [tickets, status, priority, search]);

  const fetchTickets = async () => {
    try {
      const res = await axiosInstance.get('/tickets');
      setTickets(res.data); setFiltered(res.data);
    } catch {}
  };

  return (
    <div className="container" style={{ paddingTop: '30px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px' }}>🎫 All Tickets</h1>
      <div className="card" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <input style={{ flex: 1, minWidth: '200px' }} placeholder="🔍 Search tickets..." value={search} onChange={e => setSearch(e.target.value)} />
        <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: 'auto' }}>
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <select value={priority} onChange={e => setPriority(e.target.value)} style={{ width: 'auto' }}>
          <option value="all">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>
      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: '#9ca3af' }}>No tickets found.</div>
      ) : (filtered.map(t => <TicketCard key={t.id} ticket={t} />))}
    </div>
  );
}