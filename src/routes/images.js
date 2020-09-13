const express = require('express');
const router = express.Router();

const Image = require('../models/Image');
const AlbumImage = require('../models/AlbumImage');
const Album = require('../models/Album');
const cloudinary = require("cloudinary");

//enviroment variables
require('dotenv').config();

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET
});

const fs=require('fs-extra');

//GET routes

/**
 * Request view for add a new Image 
 */
router.get('/images/new', (req, res)=>{
    res.render('images/new');
});

/**
 * Request view for show all images added 
 */
router.get('/images/show', async (req, res)=>{
    const images = await Image.find().lean();
    res.render('images/show',{images});
});


/**
 * Request view for show all image information
 */
router.get('/images/info/:id',async (req, res) =>{
    const image =await Image.findById(req.params.id).lean();
    res.render('images/info', {image});
});

/**
 * Request view for edit an image data
 */
router.get('/images/edit/:id',async (req, res) =>{
    const image =await Image.findById(req.params.id).lean();
    res.render('images/edit', {image});
});

/**
 * Request a view to show specific Images by date or name or show all images.
 */

router.get('/images/find',async (req,res)=>{

    const {date,option,title} = req.query;

    if(option==='Date'){
        const day = new Date(date);
        day.setHours(day.getHours() +(day.getTimezoneOffset()/60));

        const lastImages = await Image.find().lean();
        images = [];
        lastImages.forEach(element =>{

            if(element.date.toDateString()=== day.toDateString())
            {
                images.push(element);
            }
        })

        console.log(images);
        if(images.length===0){
            const message = [];
            message.push({message: 'There are no images for that search'});
            res.render('images/show',{date,option,title,message});
        }
        else
        {
            res.render('images/show',{images,date,option,title});
        }
        
    }
    else if(option ==='Name') {
        const images = await Image.find({
            title : title
        }).lean();

        if(images.length===0){
            const message = [];
            
            message.push({message: 'There are no images for that search'});
            res.render('images/show',{date,option,title,message});
        }
        else
        {
            res.render('images/show',{images,date,option,title});
        }

    }else{
        const images = await Image.find().lean();
        res.render('images/show',{images,date,option,title});
    }
});

//POST routes

/**
 * create a new image on data base.
 * Upload image on cloudinary
 * Check if there is another image with the same name
 */
router.post('/images/new',async (req,res)=>{

    const {title, description} = req.body;
    const errors = [];
    if(!req.file){
        errors.push({text:'please select a image from your pc'});
    }
    if(!description){
        errors.push({text:'please write a description for your image'});
    }
    
    if(errors.length>0){
        res.render('images/new',{
            errors,
            title,
            description
        });
    }
    else
    {
        const images = await Image.find({title : title}).lean();
        if(images.length>0){
            errors.push({text:'There is already an image whit that name.'});
        }

        if(errors.length>0){
            res.render('images/new',{
                errors,
                title,
                description
            });
        }
        else
        {
            const {format, width, height, bytes,secure_url,public_id} = await cloudinary.v2.uploader.upload(req.file.path);
            var day = new Date();
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
            res.redirect('/images/show');
        }
        
    }    
});


//PUT routes

/**
 * Update Image title and description
 */
router.put('/images/edit/:id',async (req,res)=>{
    const {title,description} =req.body;
    await Image.findByIdAndUpdate(req.params.id,{title,description});
    req.flash('success_msg','Image Update Succesfully.');
    res.redirect('/images/show');
});

//DELETE routes

/**
 * Delete an image from collection of image. First seach and delete from cloudinary
 * then delete from collection of iamge, also from any album and decrease the 
 * albums photos quantity.
 */
router.delete('/images/delete/:id',async (req, res)=>{
   
    const image =await Image.findById(req.params.id).lean();
    const result = await cloudinary.v2.uploader.destroy(image.public_id);
    
    await Image.findByIdAndDelete(req.params.id);
    const albumImagetoDelete = await AlbumImage.find({imageId:req.params.id});
    const result2 =await AlbumImage.deleteMany({imageId:req.params.id});
    if(albumImagetoDelete.length>0){
        albumImagetoDelete.forEach(async(element)=>{
            await Album.update({_id:element.albumId},{$inc:{imageQuantity:-1}}).lean();
        });
    }
    req.flash('success_msg','Image Deleted Succesfully.');
    res.redirect('/images/show');
});

module.exports = router;