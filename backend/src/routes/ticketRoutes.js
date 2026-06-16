// const express = require('express');
// const router = express.Router();
// const authenticate = require('../middleware/auth');
// const {
//   createTicket,
//   getTickets,
//   summarizeTicket,
//   getTicketById,
//   addComment,
//   getComments,
//   updateTicketStatus,
//   deleteTicket
// } = require('../controllers/ticketController');

// router.use(authenticate);

// router.post('/', createTicket);
// router.get('/', getTickets);
// router.get('/:id', getTicketById);
// router.get('/:id/summarize', summarizeTicket);
// router.post('/:id/comments', addComment);
// router.get('/:id/comments', getComments);
// router.put('/:id/status', updateTicketStatus);
// router.delete('/:id', deleteTicket);

// module.exports = router;

const express = require('express');
const router = express.Router();

// Add CORS headers manually
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://customer-support-ticket-system-rho.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ... rest of your routes