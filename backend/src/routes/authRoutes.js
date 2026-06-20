// const express = require('express');
// const router = express.Router();

// // Add CORS headers manually
// router.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'https://customer-support-ticket-system-rho.vercel.app');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.header('Access-Control-Allow-Credentials', 'true');
  
//   if (req.method === 'OPTIONS') {
//     return res.sendStatus(200);
//   }
//   next();
// });

// cat > authRoutes.js << 'EOF'
// const express = require('express');
// const router = express.Router();
// const { register, login } = require('../controllers/authController');

// // CORS preflight
// router.options('*', (req, res) => {
//   res.header('Access-Control-Allow-Origin', 'https://customer-support-ticket-system-rho.vercel.app');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.sendStatus(200);
// });

// router.post('/register', register);
// router.post('/login', login);

// module.exports = router;
// EOF

// ... rest of your routes


// const express = require('express');
// const router = express.Router();
// const { register, login } = require('../controllers/authController');

// // Add CORS headers to every request
// router.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'https://customer-support-ticket-system-rho.vercel.app');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.header('Access-Control-Allow-Credentials', 'true');
  
//   if (req.method === 'OPTIONS') {
//     return res.sendStatus(200);
//   }
//   next();
// });

// router.post('/register', register);
// router.post('/login', login);

// module.exports = router;


const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// CORS middleware
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

router.post('/register', register);
router.post('/login', login);

module.exports = router;