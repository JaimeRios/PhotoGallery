const AlbumImage = require('../models/AlbumImage');

const createAlbumImage = async function (albumId, imageId){
    const mewAlbumImage = new AlbumImage({
        imageId,
        albumId
    });
    const result = await mewAlbumImage.save();
    return result;
}

const findAlbumImagesByImageId = async function (id){
    const albumImages = await AlbumImage.find({imageId:id});
    return albumImages;
}

const deleteAlbumImagesByImageId = async function (id){
    const resultDelete =await AlbumImage.deleteMany({imageId:id});
    return resultDelete;
}

const deleteAlbumImage = async function (imageId, albumId){

    const resultDelete =  await AlbumImage.findOneAndDelete({imageId:imageId,albumId : albumId});
    return resultDelete;
}

const findAlbumImagesByAlbumId = async function (id){
    const albumImages = await AlbumImage.find({albumId:id});
    return albumImages;
}

exports.createAlbumImage =  createAlbumImage;
exports.findAlbumImagesByImageId = findAlbumImagesByImageId;
exports.deleteAlbumImagesByImageId = deleteAlbumImagesByImageId;
exports.deleteAlbumImage = deleteAlbumImage;
exports.findAlbumImagesByAlbumId = findAlbumImagesByAlbumId;
