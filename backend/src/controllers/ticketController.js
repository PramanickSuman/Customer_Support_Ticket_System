const pool = require('../config/database');
const aiService = require('../services/aiService');

// Create New Ticket
const createTicket = async (req, res) => {
    try {
        const { title, description, category, priority } = req.body;
        const userId = req.user.id;

        const [result] = await pool.execute(
            `INSERT INTO tickets (title, description, category, priority, user_id) 
             VALUES (?, ?, ?, ?, ?)`,
            [title, description, category, priority || 'medium', userId]
        );

        res.status(201).json({
            message: "Ticket created successfully",
            ticketId: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const getTicketById = async (req, res) => {
  try {
    const [tickets] = await pool.execute(
      `SELECT t.*, u.name as customer_name 
       FROM tickets t JOIN users u ON t.user_id = u.id 
       WHERE t.id = ?`, [req.params.id]
    );
    if (tickets.length === 0) return res.status(404).json({ message: 'Ticket not found' });
    res.json(tickets[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const addComment = async (req, res) => {
  try {
    const { message } = req.body;
    await pool.execute(
      `INSERT INTO ticket_comments (ticket_id, user_id, message) VALUES (?, ?, ?)`,
      [req.params.id, req.user.id, message]
    );
    res.status(201).json({ message: 'Comment added' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getComments = async (req, res) => {
  try {
    const [comments] = await pool.execute(
      `SELECT c.*, u.name FROM ticket_comments c 
       JOIN users u ON c.user_id = u.id 
       WHERE c.ticket_id = ? ORDER BY c.created_at ASC`,
      [req.params.id]
    );
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get All Tickets
const getTickets = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        let query = `
            SELECT t.*, u.name as customer_name 
            FROM tickets t
            JOIN users u ON t.user_id = u.id
        `;

        if (userRole === 'customer') {
            query += ` WHERE t.user_id = ?`;
        }

        query += ` ORDER BY t.created_at DESC`;

        const [tickets] = await pool.execute(query, userRole === 'customer' ? [userId] : []);

        res.json(tickets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// AI Ticket Summarization
const summarizeTicket = async (req, res) => {
    try {
        const { id } = req.params;

        const [tickets] = await pool.execute(
            `SELECT title, description FROM tickets WHERE id = ?`, [id]
        );

        const [comments] = await pool.execute(
            `SELECT c.message, u.name 
             FROM ticket_comments c 
             JOIN users u ON c.user_id = u.id 
             WHERE c.ticket_id = ? 
             ORDER BY c.created_at ASC`, [id]
        );

        if (tickets.length === 0) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        const summary = await aiService.generateSummary(comments, tickets[0].title, tickets[0].description);

        res.json({ summary });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to generate summary" });
    }
};

// Update Ticket Status
const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await pool.execute(
      `UPDATE tickets SET status = ? WHERE id = ?`,
      [status, req.params.id]
    );
    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete Ticket (admin only)
const deleteTicket = async (req, res) => {
  try {
    await pool.execute(`DELETE FROM ticket_comments WHERE ticket_id = ?`, [req.params.id]);
    await pool.execute(`DELETE FROM tickets WHERE id = ?`, [req.params.id]);
    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  createTicket, 
  getTickets, 
  summarizeTicket,
  getTicketById,
  addComment,
  getComments,
  updateTicketStatus, 
  deleteTicket
};