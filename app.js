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

// Set the view engine to Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/ScreenSurf', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Could not connect to MongoDB', err);
});

// Define routes
app.use('/signup', signupRoutes);
app.use('/login', loginRoutes);
app.use('/home', homeRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Hello World');
});

module.exports = app;
