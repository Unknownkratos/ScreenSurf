const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const signupRoutes = require('./routes/signup'); // Path to your routes file
const loginRoutes = require('./routes/login');
const homeRoutes = require('./routes/home');

const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use('/api/signup', signupRoutes); // Mount the signup routes at /api/signup
app.use('/api/login', loginRoutes);
app.use('/api/home', homeRoutes);

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
