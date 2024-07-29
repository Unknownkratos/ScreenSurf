const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Ensure this path is correct
const bcrypt = require('bcrypt'); // For password hashing

// POST request to handle login
router.post('/', async (req, res) => {
  const { username, password } = req.body; // Expect username

  try {
    // Find the user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).send('Invalid username or password'); // Unauthorized
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Invalid username or password'); // Unauthorized
    }

    // Login successful
    res.status(200).send('Login successful!');
  } catch (err) {
    console.error("Error logging in user:", err);
    res.status(500).send('Error logging in user');
  }
});

module.exports = router;
