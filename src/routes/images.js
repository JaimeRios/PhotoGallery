const express = require('express');
const router = express.Router();

const Image = require('../models/Image');
const cloudinary = require("cloudinary");

//enviroment variables
require('dotenv').config();

console.log(process.env.CLOUDINARY_CLOUD_NAME);


cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET
});


router.get('/images/add', (req, res)=>{
    res.render('images/new-image');
});

router.post('/images/new-images',async (req,res)=>{

    console.log(req.file);
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    //const result = await cloudinary.v2.uploader.upload(req.file.path, function(error, result) {console.log(result, error)});
    console.log(result);
    const {title, description} = req.body;
    const errors = [];
    if(!req.file){
        errors.push({text:'please select a image from your pc'});
    }else{
        
    }
    if(!description){
        errors.push({text:'please write a description for you image'});
    }
    if(errors.length>0){
        res.render('images/new-image',{
            errors,
            title,
            description
        });
    }
    else
    {
        date =  new Date().toISOString().split('T')[0];
        //date = new Date('2020-09-06').toISOString().split('T')[0];

        image = req.file.filename;
        localPath = req.file.path;
        const newImange = new Image({
            title,
            description,
            date,
            image: req.file.filename,
            localPath : req.file.path,
            imageUrl : result.url,
            
            public_id : result.public_id
        });
        await newImange.save();
        //console.log(newImange)
        res.redirect('/images/show-images');
    }
    
});

router.get('/images/show-images', async (req, res)=>{
    const images = await Image.find().lean();
    res.render('images/all-images',{images});
});

router.post('/images/find',async (req,res)=>{
    const {date,option,title} = req.body;

    if(option==='Date'){
        const images = await Image.find({
            date : date
        }).lean();
        res.render('images/all-images',{images,date,option,title});
    }
    else if(option ==='Name') {
        const images = await Image.find({
            title : title
        }).lean();
        res.render('images/all-images',{images,date,option,title});
    }

    
    
});
module.exports = router;