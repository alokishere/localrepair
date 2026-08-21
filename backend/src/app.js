const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;
  res.status(databaseConnected ? 200 : 503).json({
    success: true,
    message: databaseConnected ? 'LocalRepair API is running' : 'LocalRepair API is running without a database connection',
    data: {
      service: 'backend',
      status: databaseConnected ? 'ok' : 'degraded',
      database: databaseConnected ? 'connected' : 'disconnected',
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
