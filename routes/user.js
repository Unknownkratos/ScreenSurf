const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Route to fetch a user
router.get('/', async (req, res) => {
  try {
    const user = await User.findOne();
    if (user) {
      res.json(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
