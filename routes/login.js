const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET request to render the login form
router.get('/', (req, res) => {
  res.render('login'); // Render login.pug
});

// POST request to handle login form submission
router.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send('Invalid password');
    }

    // If login is successful, redirect to home page with username
    res.render('home', { username }); // Render home.pug with username
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error'); // Send 500 error response
  }
});

module.exports = router;
