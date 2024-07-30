// server.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Import routes
const signupRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');
const homeRoutes = require('./routes/home');
const userProfileRoutes = require('./routes/userprofile'); // Import user profile routes

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/ScreenSurf', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Could not connect to MongoDB', err);
});

// API routes
app.use('/api/signup', signupRoutes); // Route for signup
app.use('/api/login', loginRoutes);   // Route for login
app.use('/api/home', homeRoutes);     // Route for home (if needed)
app.use('/api', userProfileRoutes);   // Route for user profile

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Serve React app for any route not matched by API
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
