import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';

export default function CommentSection({ ticketId }) {
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => { fetchComments(); }, [ticketId]);

  const fetchComments = async () => {
    try {
      const res = await axiosInstance.get(`/tickets/${ticketId}/comments`);
      setComments(res.data);
    } catch { setComments([]); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      await axiosInstance.post(`/tickets/${ticketId}/comments`, { message });
      setMessage('');
      fetchComments();
      toast.success('Comment added!');
    } catch { toast.error('Failed to add comment'); }
  };

  return (
    <div className="card">
      <h3 style={{ marginBottom: '16px' }}>💬 Comments</h3>
      {comments.length === 0 && <p style={{ color: '#9ca3af', fontSize: '14px' }}>No comments yet.</p>}
      {comments.map((c, i) => (
        <div key={i} style={{ borderBottom: '1px solid #f3f4f6', paddingBottom: '12px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <strong style={{ fontSize: '14px' }}>{c.name}</strong>
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>{new Date(c.created_at).toLocaleString()}</span>
          </div>
          <p style={{ fontSize: '14px', color: '#374151' }}>{c.message}</p>
        </div>
      ))}
      <form onSubmit={handleSubmit} style={{ marginTop: '12px' }}>
        <textarea rows={3} value={message} onChange={e => setMessage(e.target.value)} placeholder="Write a comment..." style={{ marginBottom: '8px' }} />
        <button type="submit" className="btn btn-primary">Post Comment</button>
      </form>
    </div>
  );
}