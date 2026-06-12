import { useNavigate } from 'react-router-dom';

export default function TicketCard({ ticket }) {
  const navigate = useNavigate();
  return (
    <div className="card" style={{ cursor: 'pointer', borderLeft: '4px solid #4f46e5' }} onClick={() => navigate(`/tickets/${ticket.id}`)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '16px', marginBottom: '6px' }}>{ticket.title}</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span className={`badge badge-${ticket.status}`}>{ticket.status}</span>
          <span className={`badge badge-${ticket.priority}`}>{ticket.priority}</span>
        </div>
      </div>
      <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '8px' }}>{ticket.description?.substring(0, 100)}...</p>
      <div style={{ fontSize: '12px', color: '#9ca3af' }}>
        #{ticket.id} · {ticket.category} · {new Date(ticket.created_at).toLocaleDateString()}
        {ticket.customer_name && ` · by ${ticket.customer_name}`}
      </div>
    </div>
  );
}