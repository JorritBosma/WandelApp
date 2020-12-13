const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.wandelingSchema = Joi.object({
    wandeling: Joi.object({
        naam: Joi.string().required().escapeHTML(),
        // plaatje: Joi.string().required(),
        plaats: Joi.string().required().escapeHTML(),
        gebied: Joi.string().required().escapeHTML(),
        provincie: Joi.string().required().escapeHTML(),
        website: Joi.string().required().escapeHTML(),
        afstand: Joi.number().required().min(0),
        beschrijving: Joi.string().required().escapeHTML(),
        organisatie: Joi.string().required().escapeHTML(),
        bewegwijzering: Joi.string().required().escapeHTML()
    }).required(),
    wisPlaatjes: Joi.array()
});

module.exports.recensieSchema = Joi.object({
    recensie: Joi.object({
        beoordeling: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
})