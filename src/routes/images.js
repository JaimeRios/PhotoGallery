const express = require('express');
const router = express.Router();

const cloudinary = require("cloudinary");

const ImageService = require('../service/images');

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

    const images = await ImageService.readImages();

    res.render('images/show',{images});
});


/**
 * Request view for show all image information
 */
router.get('/images/info/:id',async (req, res) =>{

    const image =await ImageService.findImageById(req.params.id);

    res.render('images/info', {image});
});

/**
 * Request view for edit an image data
 */
router.get('/images/edit/:id',async (req, res) =>{

    const image =await ImageService.findImageById(req.params.id);

    res.render('images/edit', {image});
});

/**
 * Request a view to show specific Images by date or name or show all images.
 */

router.get('/images/find',async (req,res)=>{

    const {date,option,title} = req.query;

    if(option==='Date'){
       const result = await ImageService.findImageByDate(date);

        if(result.resultOperation==='no'){
            const message = result.message
            res.render('images/show',{date,option,title,message});
        }
        else
        {
            const images = result.images;
            res.render('images/show',{images,date,option,title});
        }
        
    }
    else if(option ==='Name') {

        const result = await ImageService.findImageByName(title);

        if(result.resultOperation==='no'){
            const message = result.message
            res.render('images/show',{date,option,title,message});
        }
        else
        {
            const images = result.images;
            res.render('images/show',{images,date,option,title});
        }

    }else{
        const images = await ImageService.readImages();
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
        const images = await ImageService.findImageByName(title);
        if(images.resultOperation==='ok'){
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

            if(public_id!==null){
                var day = new Date();
                localPath = req.file.path;
                const newImange = {
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
                };
                
                const result = await ImageService.createImage(newImange);
                if(result.resultOperation==='ok'){
                    req.flash('success_msg','Image Added Successfully');
                }
                else{
                    req.flash('error_msg','Image cannot be Added');
                }
                
            }
            await fs.unlink(req.file.path);
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
    const result =await ImageService.updateImage(req.params.id, title,description);
    
    if(result.resultOperation==='ok')
    {
        req.flash('success_msg','Image Update Succesfully.');
    }
    else
    {
        req.flash('error_msg','Image can not be Updated');
    }
    res.redirect('/images/show');
});

//DELETE routes

/**
 * Delete an image from collection of image. First seach and delete from cloudinary
 * then delete from collection of iamge, also from any album and decrease the 
 * albums photos quantity.
 */
router.delete('/images/delete/:id',async (req, res)=>{
   
    const result = await ImageService.deleteImageById(req.params.id);
    if(result.resultOperation==='ok')
    {
        req.flash('success_msg',result.message);
    }
    else
    {
        req.flash('success_msg',result.message);
    } 
    res.redirect('/images/show');
});

module.exports = router;