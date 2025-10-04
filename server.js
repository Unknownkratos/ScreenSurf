const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// CORS configuration - restrict to specific origins in production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? (process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : true)
    : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5000'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware setup
app.use(cors(corsOptions));
app.use(express.json());

// Serve static files from the React app (if built)
app.use(express.static(path.join(__dirname, 'react/dist')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Serve React app for any route not matched by API
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'react/dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'production') {
    // Only log in development
    console.log(`Server is running on port ${PORT}`);
  }
});