const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const GebruikerSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

GebruikerSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Gebruiker', GebruikerSchema);