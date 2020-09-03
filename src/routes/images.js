const express = require('express');
const router = express.Router();


router.get('/images/add', (req, res)=>{
    res.send('New image');
});

router.get('/images/show-images', (req, res)=>{
    res.send('List of images');
});

module.exports = router;