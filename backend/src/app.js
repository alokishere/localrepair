const express = require('express');
const cors = require('cors');
const app = express();

const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'LocalRepair API is running',
    data: {
      service: 'backend',
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
  });
});

app.get('/', (req, res) => {
  res.json({ success: true, message: 'LocalRepair API', data: null });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    errors: [],
  });
});

module.exports = app;
