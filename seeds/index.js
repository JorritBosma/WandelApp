const mongoose = require('mongoose');
const wandelingen = require('./wandelingen');
const Wandeling = require('../models/wandeling');

mongoose.connect('mongodb://localhost:27017/wandelapp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await Wandeling.deleteMany({});
    for (const route of wandelingen) {
        const wandeling = new Wandeling({
            naam: `${route.naam}`,
            plaats: `${route.plaats}`,
            plaatjes: `${route.plaatjes}`,
            gebied: `${route.gebied}`,
            provincie: `${route.provincie}`,
            website: `${route.website}`,
            geometry: {
                type: "Point",
                coordinates: wandeling.geometry.coordinates
            },
            afstand: `${route.afstand}`,
            beschrijving: `${route.beschrijving}`,
            bewegwijzering: `${route.bewegwijzering}`,
            organisatie: `${route.organisatie}`,
            auteur: `${route.auteur}`
        })
        await wandeling.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
})