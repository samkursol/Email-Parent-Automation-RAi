require('dotenv').config();
const express = require('express');
const cors = require('cors');
const emailRoutes = require('./routes/emailRoutes');
const schedulerService = require('./services/schedulerService');

const app = express();
const PORT = process.env.PORT || 3001; // Using 3001 to avoid conflicts with your Next.js app

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/emails', emailRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Email Automation Service'
  });
});

// Start scheduler for weekly emails
schedulerService.start();

app.listen(PORT, () => {
  console.log(`🚀 Email automation service running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;