const express = require('express');
const router = express.Router();

const Image = require('../models/Image');

router.get('/images/add', (req, res)=>{
    res.render('images/new-image');
});

router.post('/images/new-images',async (req,res)=>{
    const {name, description} = req.body;
    const errors = [];
    if(!name){
        errors.push({text:'please select a image from your pc'});
    }
    if(!description){
        errors.push({text:'please write a description for you image'});
    }
    if(errors.length>0){
        res.render('images/new-image',{
            errors,
            name,
            description
        });
    }
    else
    {
        const newImange = new Image({name,description});
        await newImange.save();
        //console.log(newImange)
        res.redirect('/images/show-images');
    }
    
});

router.get('/images/show-images', async (req, res)=>{
    const images = await Image.find().lean();
    res.render('images/all-images',{images});
});

module.exports = router;