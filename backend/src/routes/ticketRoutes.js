const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const {
  createTicket,
  getTickets,
  summarizeTicket,
  getTicketById,
  addComment,
  getComments,
  updateTicketStatus,
  deleteTicket
} = require('../controllers/ticketController');

router.use(authenticate);

router.post('/', createTicket);
router.get('/', getTickets);
router.get('/:id', getTicketById);
router.get('/:id/summarize', summarizeTicket);
router.post('/:id/comments', addComment);
router.get('/:id/comments', getComments);
router.put('/:id/status', updateTicketStatus);
router.delete('/:id', deleteTicket);

module.exports = router;