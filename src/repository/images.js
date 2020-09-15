const Image = require('../models/Image');

const createImage = async function(image){
    const newImange = new Image({
        title: image.title,
        description: image.description,
        format: image.format, 
        width: image.width, 
        height: image.height, 
        bytes: image.bytes,
        date: image.date,
        image: image.image,
        imageUrl : image.imageUrl,
        public_id : image.public_id
    });
    const result = await newImange.save();
    return result;
}

const readImages = async function(){
    const images = await Image.find().lean();
    return images;
}

const findImageById = async function (id){
    const images = await Image.findById(id).lean();
    return images;
}

const findImageByName = async function (title){
    const image = await Image.find({
        title : title
    }).lean();
    return image;
}

const updateImage = async function (id, title, description){
    const result = await Image.findByIdAndUpdate(id,{title,description});
    return result;
}

const deleteImageById = async function (id){
    const result = await Image.findByIdAndDelete(id);
    return result;
}

const findAllImageNoIncludedByListId = async function (listImagesId){
    const images =await Image.find({_id:{$nin:listImagesId}}).lean();
    return images;
}

const findAllImageIncludedByListId = async function (listImagesId){
    const images =await Image.find({_id:{$in:listImagesId}}).lean();
    return images;
}

exports.createImage = createImage;
exports.readImages = readImages;
exports.findImageById = findImageById;
exports.findImageByName = findImageByName;
exports.updateImage = updateImage;
exports.deleteImageById = deleteImageById;
exports.findAllImageNoIncludedByListId = findAllImageNoIncludedByListId;
exports.findAllImageIncludedByListId = findAllImageIncludedByListId;
