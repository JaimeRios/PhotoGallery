const ImageRepository = require('../repository/images');
const AlbumRepository = require('../repository/albums');
const AlbumImageRepository = require('../repository/albumImage');


const createAlbum = async function(album){
    const albumR = await AlbumRepository.createAlbum(album);
    if(albumR._id!==null){
        const result = {resultOperation: 'ok'};
        return result;
    }
    else
    {
        const result = {resultOperation: 'no'};
        return result;
    }
}

const readAlbums = async function(){
    const albums = await AlbumRepository.readAlbums();
    return albums;
}

const findAlbumById = async function (id){
    const albums = await AlbumRepository.findAlbumById(id);
    return albums;
}

const findAlbumByName = async function (title){
    const albums = await AlbumRepository.findAlbumByName(title);

    if(albums.length===0){
        const message = [];
        message.push({message: 'There are no albums for that search'});
        const result = {resultOperation: 'no',message: message};
        return result;
    }
    else
    {
        const result = {resultOperation: 'ok',albums: albums};
        return result;
    }
}

const updateAlbum = async function (id, title, description){
    const album = await AlbumRepository.updateAlbum(id, title, description);
    if(title===album.title && description ===album.description){
         const result = {resultOperation: 'ok'};
        return result;
    }
    else
    {
        const result = {resultOperation: 'no'};
        return result;
    }
}

const searchImageNotInAlbumByAlbumId = async function (id){
    //Search all Image already in selected album 
    const albumImage = await AlbumImageRepository.findAlbumImagesByAlbumId(id);
    const ImageIds = [];
    
    albumImage.forEach(async (element)=>{
        ImageIds.push(element.imageId);
    });

    //Search all image no already in album
    const images =await ImageRepository.findAllImageNoIncludedByListId(ImageIds);

    return images;
}

const searchAllImagebyAlbumId = async function(id){
    //Search all Image already in selected album 
    const albumImage = await AlbumImageRepository.findAlbumImagesByAlbumId(id);

    const ImageIds = [];
    
    albumImage.forEach(async (element)=>{
        ImageIds.push(element.imageId);
    });

    //Search all image iformation inalbum selected 
    const images =await ImageRepository.findAllImageIncludedByListId(ImageIds);
    return images;
}

const addImagetoAlbum = async function(albumId, imageId){

    const albumImageR = AlbumImageRepository.createAlbumImage(albumId, imageId);
    //Increase count of image of album

        if(albumImageR._id!==null){
            const AlbumR = AlbumRepository.UpdateandIncreaseAlbumImageQuantityById(albumId);
            const result = {resultOperation: 'ok'};
            return result;
        }
        else
        {
            const result = {resultOperation: 'no'};
            return result;
        }
}

const deleteImageFromAlbum = async function (imageId, albumId){
    const resultDelete = await  AlbumImageRepository.deleteAlbumImage(imageId, albumId);
    if(resultDelete._id!==null)
    {
        const resultIA =await AlbumRepository.UpdateandDecreseaseAlbumImageQuantityById(albumId);
        const result = {resultOperation: 'ok'};
        return result;
    }
    else{

        const result = {resultOperation: 'no'};
        return result;
    }
}


exports.createAlbum = createAlbum;
exports.readAlbums = readAlbums;
exports.findAlbumById = findAlbumById;
exports.findAlbumByName = findAlbumByName;
exports.updateAlbum = updateAlbum;
exports.searchImageNotInAlbumByAlbumId = searchImageNotInAlbumByAlbumId;
exports.searchAllImagebyAlbumId = searchAllImagebyAlbumId;
exports.addImagetoAlbum = addImagetoAlbum;
exports.deleteImageFromAlbum = deleteImageFromAlbum;