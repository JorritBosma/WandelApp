const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recensieSchema = new Schema({
    body: String,
    beoordeling: Number,
    auteur: {
        type: Schema.Types.ObjectId,
        ref: 'Gebruiker'
    }
});

module.exports = mongoose.model('Recensie', recensieSchema);

