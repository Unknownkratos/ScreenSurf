const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware setup
app.use(cors());
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
  console.log(`Server is running on port ${PORT}`);
});