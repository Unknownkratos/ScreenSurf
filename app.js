const express = require('express');
const mongoose = require('mongoose');
const signupRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');
const homeRoutes = require('./routes/home');
const path = require('path');

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up the view engine if needed (e.g., Pug for server-rendered views)
// app.set('view engine', 'pug');
// app.set('views', path.join(__dirname, 'views'));

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/ScreenSurf', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Could not connect to MongoDB', err);
});

// API routes
app.use('/api/signup', signupRoutes); // Handle signup requests
app.use('/api/login', loginRoutes);   // Handle login requests
app.use('/api/home', homeRoutes);     // Handle home requests

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Serve React app for any route not matched by API
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

module.exports = app;
