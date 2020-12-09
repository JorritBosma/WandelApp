const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recensieSchema = new Schema({
    body: String,
    beoordeling: Number
});

module.exports = mongoose.model('Recensie', recensieSchema);

