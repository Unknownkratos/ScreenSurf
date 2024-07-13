const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('home'); // This renders signup.pug
});

module.exports = router;
