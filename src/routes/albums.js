const express = require('express');
const Album = require('../models/Album');
const Image = require('../models/Image');
const AlbumImage = require('../models/AlbumImage');
const router = express.Router();

//GET routes

/**
 * Request view for add a new Album 
 */
router.get('/albums/new', (req, res)=>{
    res.render('albums/new');
});

/**
 * Request view to show all albums
 */
router.get('/albums/show', async (req, res)=>{
    const albums = await Album.find().lean();
    res.render('albums/show',{albums});
});

/**
 * Request view for edit an album data
 */
router.get('/albums/edit/:id',async (req, res) =>{
    const album =await Album.findById(req.params.id).lean();
    res.render('albums/edit', {album});
});

/**
 * Request view to add a new image to specific album id
 */
router.get('/albums/newImage/:id',async (req, res) =>{
    const albumId = req.params.id;
    //Search all Image already in selected album 
    const albumImage = await AlbumImage.find({albumId}).lean();;
    const ImageIds = [];
    
    console.log(albumImage);
    console.log(albumId);

    albumImage.forEach(async (element)=>{
        ImageIds.push(element.imageId);
    });

    //Search all image no in already in album
    const images =await Image.find({_id:{$nin:ImageIds}}).lean();

    //const albumId2= albumId.replace(':','');
    //console.log(albumId2);

    res.render('albums/newImage', {images,albumId});
});

/**
 * Request image from specific album id
 */
router.get('/albums/images/:id', async(req, res)=>{
    const albumId = req.params.id;
    //Search all Image already in selected album 
    const albumImage = await AlbumImage.find({albumId}).lean();;

    const ImageIds = [];
    
    albumImage.forEach(async (element)=>{
        ImageIds.push(element.imageId);
    });

    //Search all ime no in already in album
    const images =await Image.find({_id:{$in:ImageIds}}).lean();

    res.render('albums/images', {images,albumId});
});

//POST routes
/**
 * Create a new album
 * check it if there is another album created before with the same name
 */
router.post('/albums/new', async (req, res)=>{
    
    const {title, description} = req.body;
    const errors = [];
    if(!title){
        errors.push({text:'please write a title for your album.'});
    }
    if(!description){
        errors.push({text:'please write a description for your album.'});
    }

    if(errors.length>0){
        res.render('albums/new',{
            errors,
            title,
            description
        });
    }
    else
    {
        const album = await Album.find({title : title}).lean();
        if(album.length>0){
            errors.push({text:'There is already an album whit the same name.'});
        }

        if(errors.length>0){
            res.render('albums/new',{
                errors,
                title,
                description
            });
        }
        else
        {
            var day = new Date();
            const newAlbum = new Album({
                title,
                description,
                date: day
            });
            await newAlbum.save();

            res.redirect('/albums/show');
        }
        
    }

});

/**
 * Create a reference of an Image in album Id
 * increase album image quantity
 */
router.post('/albums/newImage',async (req, res) =>{
    const {imageId,albumId} = req.body;

    //Increase count of image of album

    const mewAlbumImage = new AlbumImage({
        imageId,
        albumId
    });
    await mewAlbumImage.save();
    
    await Album.update({_id: albumId},{$inc:{imageQuantity:1}}).lean();
 
    req.flash('success_msg','Image Added Successfully to Album');
    const albums = await Album.find().lean();
    res.render('albums/show',{albums});
});

//PUT routes

/**
 * Update Album title and description
 */
router.put('/albums/edit/:id',async (req,res)=>{
    const {title,description} =req.body;
    await Album.findByIdAndUpdate(req.params.id,{title,description});
    req.flash('success_msg','Album Update Succesfully.');
    res.redirect('/albums/show');
});

//DELETE routes

/**
 * Delete reference of one image id from an specific album id
 */
router.delete('/albumImage/delete/:albumId/:id',async (req, res)=>{

    const result =  await AlbumImage.findOneAndDelete({imageId:req.params.id,albumId : req.params.albumId});
    await Album.update({_id: req.params.albumId},{$inc:{imageQuantity:-1}}).lean();
     req.flash('success_msg','Image Deleted Succesfully.');
     res.redirect('/albums/images/'+req.params.albumId);
});


module.exports = router;