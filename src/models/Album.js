const mongoose = require('mongoose');
const {Schema} =mongoose;

//Create new Schema
const AlbumSchema = new Schema({
    title :{type: String, required: true},
    description: {type: String, required: true},
    imageQuantity: {type: Number, default: 0},
    date: {type: Date, default: Date.now }

});

//Export Schema
module.exports = mongoose.model('Album',AlbumSchema);