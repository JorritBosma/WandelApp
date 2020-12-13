const mongoose = require('mongoose');
const Recensie = require('./recensie');
const Schema = mongoose.Schema;

const PlaatjeSchema = new Schema({
    url: String,
    filename: String,
});

PlaatjeSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const WandelingSchema = new Schema({
    naam: String,
    plaatjes: [PlaatjeSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
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