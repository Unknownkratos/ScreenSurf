const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const signupRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');

const path = require('path'); // Import path module for file path operations

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Set the view engine to Pug
app.set('view engine', 'pug');

// Set the directory where your views (Pug files) are located
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

// Define your routes
app.use('/user', userRoutes);
app.use('/signup', signupRoutes);
app.use('/login', loginRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Hello World');
});

module.exports = app;
