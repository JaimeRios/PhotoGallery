const ImageRepository = require('../repository/images');
const AlbumImageRepository = require('../repository/albumImage');
const AlbumRepository = require('../repository/albums');

const cloudinary = require("cloudinary");
//enviroment variables
require('dotenv').config();

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET
});

const createImage = async function(image){
    const imageR = await ImageRepository.createImage(image);
    if(imageR._id!==null){
        const result = {resultOperation: 'ok'};
        return result;
    }
    else
    {
        const result = {resultOperation: 'no'};
        return result;
    }
}

const readImages = async function (){
    const images = await ImageRepository.readImages();
    return images;
}

const findImageById = async function (id){
    const images = await ImageRepository.findImageById(id);
    return images;
}

const findImageByDate = async function (date){

    const day = new Date(date);
    day.setHours(day.getHours() +(day.getTimezoneOffset()/60));

    const lastImages = await ImageRepository.readImages();
    images = [];
    lastImages.forEach(element =>{

        if(element.date.toDateString()=== day.toDateString())
        {
            images.push(element);
        }
    })

    if(images.length===0){
        const message = [];
        message.push({message: 'There are no images for that search'});
        const result = {resultOperation: 'no',message: message};
        return result;
    }
    else
    {
        const result = {resultOperation: 'ok',images: images};
        return result;
    }
}

const findImageByName = async function (title){
    const images = await ImageRepository.findImageByName(title);

    if(images.length===0){
        const message = [];
        message.push({message: 'There are no images for that search'});
        const result = {resultOperation: 'no',message: message};
        return result;
    }
    else
    {
        const result = {resultOperation: 'ok',images: images};
        return result;
    }
}

const updateImage = async function (id, title, description){
    const image = await ImageRepository.updateImage(id, title, description);
    if(title===image.title && description ===image.description){
         const result = {resultOperation: 'ok'};
        return result;
    }
    else
    {
        const result = {resultOperation: 'no'};
        return result;
    }
}


const deleteImageById = async function (id){
    const image =await ImageRepository.findImageById(id);
    let message = 'Image Deleted Succesfully';
    if(image !== null){
        const resultDeleteCloudinary = await cloudinary.v2.uploader.destroy(image.public_id);
        if(resultDeleteCloudinary.result=== 'ok'){

            const resultDelete = await ImageRepository.deleteImageById(id);

            if(resultDelete._id!==null){
                const albumImagetoDelete = await AlbumImageRepository.findAlbumImagesByImageId(id);
                const result2 =await AlbumImageRepository.deleteAlbumImagesByImageId(id);
                if(albumImagetoDelete.length>0){
                    albumImagetoDelete.forEach(async(element)=>{
                        await AlbumRepository.UpdateandDecreseaseAlbumImageQuantityById(element.albumId);
                    });
                    message += ' also all his references in albums has been deleted too.';
                }
                else{
                    message += '.';
                }
                const result = {resultOperation: 'ok', message: message};
                return result;
            }
        }
        else
        {
            message = 'Image could no be Deleted.';
            const result = {resultOperation: 'no', message: message};
            return result;
        }
        
    }
    else 
    {
        message = 'Image could no be Deleted.';
        const result = {resultOperation: 'no', message: message};
        return result;
    }
}

exports.createImage = createImage; 
exports.readImages = readImages;
exports.findImageById = findImageById;
exports.findImageByDate = findImageByDate;
exports.findImageByName = findImageByName;
exports.updateImage = updateImage;
exports.deleteImageById = deleteImageById;
