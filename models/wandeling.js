const mongoose = require('mongoose');
const Recensie = require('./recensie');
const Schema = mongoose.Schema;

const WandelingSchema = new Schema({
    naam: String,
    foto: String,
    plaats: String,
    gebied: String,
    provincie: String,
    website: String,
    afstand: Number,
    beschrijving: String,
    organisatie: String,
    bewegwijzering: String,
    auteur: {
        type: Schema.Types.ObjectId,
        ref: 'Gebruiker'
    },
    recensies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Recensie'
        }
    ]
});

WandelingSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Recensie.deleteMany({
            _id: {
                $in: doc.recensies
            }
        })
    }
});

module.exports = mongoose.model('Wandeling', WandelingSchema);