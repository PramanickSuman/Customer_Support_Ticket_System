const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./config/database');

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const app = express();
const PORT = process.env.PORT || 5000;

// CORS - Allow frontend origin
app.use(cors({
  origin: '*',
  credentials: false
}));

// Preflight requests
app.options('*', cors());

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Test Routes
app.get('/', (req, res) => {
  res.send('✅ Backend Running!');
});

app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT 1');
    res.json({ status: 'OK', database: 'Connected' });
  } catch (error) {
    res.status(500).json({ status: 'Error', database: 'Disconnected' });
  }
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;