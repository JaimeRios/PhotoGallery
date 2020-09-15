const express = require('express');

const AlbumService = require('../service/albums');
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
    const albums = await AlbumService.readAlbums();
    res.render('albums/show',{albums});
});

/**
 * Request view for edit an album data
 */
router.get('/albums/edit/:id',async (req, res) =>{
    const album =await AlbumService.findAlbumById(req.params.id);
    res.render('albums/edit', {album});
});

/**
 * Request view to add a new image to specific album id
 */
router.get('/albums/newImage/:id',async (req, res) =>{
    const albumId = req.params.id;
    const images =await AlbumService.searchImageNotInAlbumByAlbumId(albumId);
     res.render('albums/newImage', {images,albumId});
});

/**
 * Request image from specific album id
 */
router.get('/albums/images/:id', async(req, res)=>{
    const albumId = req.params.id;
    const images =await AlbumService.searchAllImagebyAlbumId(albumId);
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
        const album = await AlbumService.findAlbumByName(title);
        if(album.resultOperation==='ok'){
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
            const newAlbum = {
                title,
                description,
                date: day
            };
            const result = await AlbumService.createAlbum(newAlbum);
                if(result.resultOperation==='ok'){
                    req.flash('success_msg','Album Added Successfully');
                }
                else{
                    req.flash('error_msg','Album cannot be Added');
                }

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

    const result = AlbumService.addImagetoAlbum(albumId,imageId);

    if(result.resultOperation==='ok'){
        req.flash('success_msg','Image Added Successfully to Album');
    }
    else{
        req.flash('error_msg','Image can not be Added to Album');
    }

    res.redirect('/albums/show');
});

//PUT routes

/**
 * Update Album title and description
 */
router.put('/albums/edit/:id',async (req,res)=>{

    const {title,description} =req.body;
    const result =await AlbumService.updateAlbum(req.params.id, title,description);
    
    if(result.resultOperation==='ok')
    {
        req.flash('success_msg','Album Update Succesfully.');
    }
    else
    {
        req.flash('error_msg','Album can not be Updated');
    }
    res.redirect('/albums/show');
});

//DELETE routes

/**
 * Delete reference of one image id from an specific album id
 */
router.delete('/albumImage/delete/:albumId/:id',async (req, res)=>{

    const result = await AlbumService.deleteImageFromAlbum(req.params.id, req.params.albumId);
    if(result.resultOperation==='ok'){
        req.flash('success_msg','Image Deleted Succesfully.');
    }
    else{
        req.flash('error_msg','Image can not no be Deleted.');
    }
     
     res.redirect('/albums/images/'+req.params.albumId);
});


module.exports = router;