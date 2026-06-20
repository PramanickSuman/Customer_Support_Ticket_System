const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const pool = require('../config/database');

// Get all pending support agents (admin only)
router.get('/pending-agents', authenticate, async (req, res) => {
  try {
    console.log('Admin request - User:', req.user);
    
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const [agents] = await pool.execute(
      'SELECT id, name, email, role, is_approved, created_at FROM users WHERE role = ? AND is_approved = ?',
      ['support_agent', 0]
    );

    res.json(agents);
  } catch (error) {
    console.error('Error fetching pending agents:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve a support agent (admin only)
router.put('/approve-agent/:id', authenticate, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { id } = req.params;

    await pool.execute(
      'UPDATE users SET is_approved = 1 WHERE id = ? AND role = ?',
      [id, 'support_agent']
    );

    res.json({ message: 'Support agent approved successfully' });
  } catch (error) {
    console.error('Error approving agent:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;