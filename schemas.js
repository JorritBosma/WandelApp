const Joi = require('joi');

module.exports.wandelingSchema = Joi.object({
    wandeling: Joi.object({
        naam: Joi.string().required(),
        // plaatje: Joi.string().required(),
        plaats: Joi.string().required(),
        gebied: Joi.string().required(),
        provincie: Joi.string().required(),
        website: Joi.string().required(),
        afstand: Joi.number().required().min(0),
        beschrijving: Joi.string().required(),
        organisatie: Joi.string().required(),
        bewegwijzering: Joi.string().required()
    }).required(),
    wisPlaatjes: Joi.array()
});

module.exports.recensieSchema = Joi.object({
    recensie: Joi.object({
        beoordeling: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})