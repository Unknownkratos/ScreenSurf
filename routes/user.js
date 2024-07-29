const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Ensure this path is correct
const authenticateToken = require('../middleware/authenticateToken'); // Import the middleware

// Route to fetch user data
router.get('/api/user', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).send('Error fetching user data');
  }
});

module.exports = router;
