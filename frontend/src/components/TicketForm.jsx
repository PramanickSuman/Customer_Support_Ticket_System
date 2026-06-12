import { useState } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../utils/axiosInstance';

export default function TicketForm({ onSuccess }) {
  const [form, setForm] = useState({ title: '', description: '', category: 'general', priority: 'medium' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post('/tickets', form);
      toast.success('Ticket created!');
      setForm({ title: '', description: '', category: 'general', priority: 'medium' });
      onSuccess?.();
    } catch { toast.error('Failed to create ticket'); }
    finally { setLoading(false); }
  };

  return (
    <div className="card">
      <h3 style={{ marginBottom: '16px', color: '#4f46e5' }}>➕ Create New Ticket</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required placeholder="Brief description of your issue" />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} required placeholder="Describe your issue in detail..." />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label>Category</label>
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              <option value="general">General</option>
              <option value="billing">Billing</option>
              <option value="technical">Technical</option>
              <option value="account">Account</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Ticket'}
        </button>
      </form>
    </div>
  );
}