const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    name: String,
    size: Number,
    mimetype: String,
    uploaded_at: { type: Date, default: Date.now }, 
    modified_at: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('File', fileSchema);
