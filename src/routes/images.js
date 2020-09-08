const express = require('express');
const router = express.Router();

const Image = require('../models/Image');
const cloudinary = require("cloudinary");

//enviroment variables
require('dotenv').config();

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET
});

const fs=require('fs-extra');

router.get('/images/add', (req, res)=>{
    res.render('images/new-image');
});

router.post('/images/new-images',async (req,res)=>{

    console.log(req.file);
    
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
        const {format, width, height, bytes,secure_url,public_id} = await cloudinary.v2.uploader.upload(req.file.path);
        //const result = await cloudinary.v2.uploader.upload(req.file.path, function(error, result) {console.log(result, error)});
        //console.log(result);

        var day = new Date();
        //yesterday.setDate(yesterday.getDate() - 1);

        image = req.file.filename;
        localPath = req.file.path;
        const newImange = new Image({
            title,
            description,
            format, 
            width, 
            height, 
            bytes,
            date: day,
            image: req.file.filename,
            imageUrl : secure_url,
            public_id : public_id
        });
        await newImange.save();
        await fs.unlink(req.file.path);
        req.flash('success_msg','Image Added Successfully');
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

router.get('/images/info/:id',async (req, res) =>{
    const image =await Image.findById(req.params.id).lean();
    res.render('images/image-info', {image});
});

router.get('/images/edit/:id',async (req, res) =>{
    const image =await Image.findById(req.params.id).lean();
    res.render('images/image-edit', {image});
});

router.put('/images/edit-image/:id',async (req,res)=>{
    const {title,description} =req.body;
    await Image.findByIdAndUpdate(req.params.id,{title,description});
    req.flash('success_msg','Image Update Succesfully.');
    res.redirect('/images/show-images');
});

router.delete('/images/delete/:id',async (req, res)=>{
    const image =await Image.findById(req.params.id).lean();
    const result = await cloudinary.v2.uploader.destroy(image.public_id);
    console.log(result);
    await Image.findByIdAndDelete(req.params.id);
    req.flash('success_msg','Image Deleted Succesfully.');
    res.redirect('/images/show-images');
});
module.exports = router;