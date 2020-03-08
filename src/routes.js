const express = require('express');
const router = express.Router();

router.get('/foto', (req,res) => {
    res.send('teste');
})

module.exports = router;