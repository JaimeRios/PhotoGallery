const mongoose = require('mongoose');
const {Schema} =mongoose;

//Create new Schema
const ImageSchema = new Schema({
    title :{type: String, required: true},
    image: {type: String, required: true},
    description: {type: String, required: true},
    format: {type: String, required: true},
    width: {type: Number, required: true},
    height: {type: Number, required: true},
    bytes: {type: Number, required: true},
    date: {type: Date, default: Date.now },
    imageUrl: {type: String, required: true},
    public_id: {type: String, required: true}

});

//Export Schema
module.exports = mongoose.model('Image',ImageSchema);