const express = require('express');
const router = express.Router();


router.get('/albums/add', (req, res)=>{
    res.render('');
});

router.get('/albums/show-albums', (req, res)=>{
    res.render('albums/all-albums');
});

module.exports = router;