const Album = require('../models/Album');

const createAlbum = async function(album){

    const newAlbum = new Album({
        title: album.title,
        description: album.description,
        date: album.date
    });
    const result = await newAlbum.save();
    return result;
}

const UpdateandDecreseaseAlbumImageQuantityById = async function (id){
    const result = await Album.updateOne({_id:id},{$inc:{imageQuantity:-1}}).lean();
    return result;
}

const UpdateandIncreaseAlbumImageQuantityById = async function (id){
    const result = await Album.updateOne({_id:id},{$inc:{imageQuantity:1}}).lean();
    return result;
}

const readAlbums = async function(){
    const albums = await Album.find().lean();
    return albums;
}

const findAlbumById = async function (id){
    const albums = await Album.findById(id).lean();
    return albums;
}

const findAlbumByName = async function (title){
    const albums = await Album.find({
        title : title
    }).lean();
    return albums;
}

const updateAlbum = async function (id, title, description){
    const result = await Album.findByIdAndUpdate(id,{title,description});
    return result;
}

exports.createAlbum = createAlbum;
exports.readAlbums = readAlbums;
exports.UpdateandDecreseaseAlbumImageQuantityById = UpdateandDecreseaseAlbumImageQuantityById;
exports.UpdateandIncreaseAlbumImageQuantityById = UpdateandIncreaseAlbumImageQuantityById;
exports.findAlbumById = findAlbumById;
exports.findAlbumByName = findAlbumByName;
exports.updateAlbum = updateAlbum;
