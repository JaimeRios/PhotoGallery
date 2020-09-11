const mongoose = require('mongoose');
const {Schema} =mongoose;

//Create new Schema
const AlbumImageSchema = new Schema({
    imageId :{type: String, required: true},
    albumId: {type: String, required: true},
});

//Export Schema
module.exports = mongoose.model('AlbumImage',AlbumImageSchema);