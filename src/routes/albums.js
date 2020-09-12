const express = require('express');
const Album = require('../models/Album');
const Image = require('../models/Image');
const AlbumImage = require('../models/AlbumImage');
const router = express.Router();


router.get('/albums/add', (req, res)=>{
    res.render('albums/new-album');
});

router.post('/albums/new-album', async (req, res)=>{
    
    const {title, description} = req.body;
    const errors = [];
    if(!title){
        errors.push({text:'please write a title for your album.'});
    }
    if(!description){
        errors.push({text:'please write a description for your album.'});
    }

    if(errors.length>0){
        res.render('albums/new-album',{
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

        res.redirect('/albums/show-albums');
    }

});

router.get('/albums/show-albums', async (req, res)=>{
    const albums = await Album.find().lean();
    res.render('albums/all-albums',{albums});
});


router.get('/albums/show-addImage/:id',async (req, res) =>{
    const albumId = req.params.id.replace(':','');
    //Search all Image already in selected album 
    const albumImage = await AlbumImage.find({albumId}).lean();;
    const ImageIds = [];
    
    console.log(albumImage);
    console.log(albumId);

    albumImage.forEach(async (element)=>{
        ImageIds.push(element.imageId);
    });

    //Search all ime no in already in album
    const images =await Image.find({_id:{$nin:ImageIds}}).lean();

    const albumId2= albumId.replace(':','');
    console.log(albumId2);

    res.render('albums/add-image-to-album', {images,albumId2});
});

router.get('/album/show-albumImages/:id', async(req, res)=>{
    const albumId = req.params.id.replace(':','');
    //Search all Image already in selected album 
    const albumImage = await AlbumImage.find({albumId}).lean();;

    const ImageIds = [];
    
    albumImage.forEach(async (element)=>{
        ImageIds.push(element.imageId);
    });

    //Search all ime no in already in album
    const images =await Image.find({_id:{$in:ImageIds}}).lean();

    res.render('albums/show-album', {images,albumId});
});

router.post('/albums/add-Image',async (req, res) =>{
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
    res.render('albums/all-albums',{albums});
});


router.delete('/albumImage/delete/:albumId/:id',async (req, res)=>{

    const result =  await AlbumImage.findOneAndDelete({imageId:req.params.id,albumId : req.params.albumId});
    await Album.update({_id: albumId},{$inc:{imageQuantity:-1}}).lean();
     req.flash('success_msg','Image Deleted Succesfully.');
     res.send('ok')
     res.redirect('/album/show-albumImages/'+req.params.albumId);
});

module.exports = router;