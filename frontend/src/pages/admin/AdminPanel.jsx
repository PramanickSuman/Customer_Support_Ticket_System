import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';

export default function AdminPanel() {
  const [pendingAgents, setPendingAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') {
      toast.error('Access denied. Admin only.');
      navigate('/dashboard');
      return;
    }
    fetchAgents();
  }, [navigate]);

  const fetchAgents = async () => {
    try {
      const response = await axiosInstance.get('/admin/pending-agents');
      setPendingAgents(response.data);
      setLoading(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch agents');
      setLoading(false);
    }
  };

  const approveAgent = async (agentId) => {
    try {
      await axiosInstance.put(`/admin/approve-agent/${agentId}`);
      toast.success('Agent approved successfully!');
      fetchAgents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve agent');
    }
  };

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ color: '#4f46e5', marginBottom: '30px' }}>👨‍💼 Admin Panel</h1>

      <div style={{ backgroundColor: '#white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#ef4444', marginBottom: '20px' }}>⏳ Pending Support Agents</h2>
        {pendingAgents.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>No pending agents to approve</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f2f5', borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Email</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Requested</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingAgents.map(agent => (
                <tr key={agent.id} style={{ borderBottom: '1px solid #ddd', hover: { backgroundColor: '#f9f9f9' } }}>
                  <td style={{ padding: '12px' }}>{agent.name}</td>
                  <td style={{ padding: '12px' }}>{agent.email}</td>
                  <td style={{ padding: '12px' }}>{new Date(agent.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button
                      onClick={() => approveAgent(agent.id)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        transition: 'background-color 0.3s'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
                    >
                      ✓ Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}