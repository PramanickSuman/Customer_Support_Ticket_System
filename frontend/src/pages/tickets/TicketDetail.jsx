import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import CommentSection from '../../components/CommentSection';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [summary, setSummary] = useState('');
  const [summarizing, setSummarizing] = useState(false);

  const fetchTicket = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/tickets/${id}`);
      setTicket(res.data);
    } catch { toast.error('Failed to load ticket'); }
  }, [id]);

  useEffect(() => { fetchTicket(); }, [fetchTicket]);

  const handleSummarize = async () => {
    setSummarizing(true);
    try {
      const res = await axiosInstance.get(`/tickets/${id}/summarize`);
      setSummary(res.data.summary);
    } catch { toast.error('Failed to generate summary'); }
    finally { setSummarizing(false); }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await axiosInstance.put(`/tickets/${id}/status`, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      fetchTicket();
    } catch { toast.error('Failed to update status'); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;
    try {
      await axiosInstance.delete(`/tickets/${id}`);
      toast.success('Ticket deleted!');
      navigate('/tickets');
    } catch { toast.error('Failed to delete ticket'); }
  };

  const getNextStatuses = (currentStatus) => {
    const flow = {
      'open': ['in_progress'],
      'in_progress': ['closed'],
      'closed': []
    };
    return flow[currentStatus] || [];
  };

  if (!ticket) return <div className="container" style={{ paddingTop: '30px' }}>Loading...</div>;

  const nextStatuses = getNextStatuses(ticket.status);
  const canChangeStatus = user?.role === 'support_agent' || user?.role === 'admin';
  const canDelete = user?.role === 'admin';

  return (
    <div className="container" style={{ paddingTop: '30px' }}>
      <div className="card" style={{ borderLeft: '4px solid #4f46e5' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 700 }}>{ticket.title}</h1>
          {canDelete && (
            <button className="btn btn-danger"
              style={{ fontSize: '12px', padding: '4px 12px' }}
              onClick={handleDelete}>
              🗑️ Delete
            </button>
          )}
        </div>

        <p style={{ color: '#374151', marginBottom: '16px' }}>{ticket.description}</p>

        <div style={{ display: 'flex', gap: '24px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</div>
            <span className={`badge badge-${ticket.status}`} style={{ fontSize: '13px', padding: '5px 14px' }}>
              {ticket.status.replace('_', ' ')}
            </span>
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Priority</div>
            <span className={`badge badge-${ticket.priority}`} style={{ fontSize: '13px', padding: '5px 14px' }}>
              {ticket.priority}
            </span>
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</div>
            <span style={{ fontSize: '13px', color: '#374151', fontWeight: 600 }}>{ticket.category}</span>
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Created</div>
            <span style={{ fontSize: '13px', color: '#374151' }}>{new Date(ticket.created_at).toLocaleString()}</span>
          </div>
          {ticket.customer_name && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Raised By</div>
              <span style={{ fontSize: '13px', color: '#374151', fontWeight: 600 }}>👤 {ticket.customer_name}</span>
            </div>
          )}
        </div>

        {canChangeStatus && nextStatuses.length > 0 && (
          <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '14px' }}>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px', fontWeight: 600 }}>CHANGE STATUS</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {nextStatuses.map(status => (
                <button key={status} className="btn btn-success"
                  style={{ fontSize: '13px' }}
                  onClick={() => handleStatusChange(status)}>
                  ✓ Mark as {status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card" style={{ borderLeft: '4px solid #8b5cf6' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3>🤖 AI Summary</h3>
          <button className="btn btn-primary" onClick={handleSummarize}
            disabled={summarizing} style={{ background: '#8b5cf6' }}>
            {summarizing ? 'Generating...' : '✨ Summarize Ticket'}
          </button>
        </div>
        {summary ? (
          <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', background: '#f5f3ff', padding: '12px', borderRadius: '6px' }}>
            {summary}
          </p>
        ) : (
          <p style={{ color: '#9ca3af', fontSize: '13px' }}>Click the button to generate an AI summary.</p>
        )}
      </div>

      <CommentSection ticketId={id} />
    </div>
  );
}