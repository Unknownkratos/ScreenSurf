const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('signup'); // This renders signup.pug
});

module.exports = router;
