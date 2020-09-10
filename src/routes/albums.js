const express = require('express');
const Album = require('../models/Album');
const Image = require('../models/Image');
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
    const idAlbum = req.params.id;
    const images =await Image.find().lean();
    res.render('albums/add-image-to-album', {images,idAlbum});
});

router.post('/albums/addImage',async (req, res) =>{
    //const idAlbum = req.params.id;
   // console.log(req.params);
    
    console.log(req.body);
    const {_id} = req.body;
    res.send('ok');
});
module.exports = router;