const express = require('express');
const router = express.Router();


router.get('/albums/add', (req, res)=>{
    res.send('new albums');
});

router.get('/albums/show-albums', (req, res)=>{
    res.send('List of albums');
});

module.exports = router;