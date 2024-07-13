const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET request to render the signup form
router.get('/', (req, res) => {
  console.log("Rendering signup form");
  res.render('signup'); // This renders signup.pug
});

// POST request to handle form submission
router.post('/', async (req, res) => {
  const { username, password } = req.body;
  console.log("Received form data:", req.body);

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log("Username already taken");
      return res.status(400).send('Username is already taken');
    }

    // Create a new user
    const user = new User({ username, password });
    await user.save();
    console.log("User registered successfully");

    res.status(201).send('User registered successfully');
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).send('Error registering user');
  }
});

module.exports = router;
