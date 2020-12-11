const { wandelingSchema, recensieSchema } = require('./schemas');
const ExpressError = require('./helpers/ExpressError');
const Wandeling = require('./models/wandeling');
const Recensie = require('./models/recensie');

module.exports.isIngelogd = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Je moet ingelogd zijn om dat te kunnen doen...')
        return res.redirect('/inloggen');
    }
    next();
};

module.exports.validateWandeling = (req, res, next) => {
    const { error } = wandelingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

module.exports.isAuteur = async (req, res, next) => {
    const { id } = req.params;
    const wandeling = await Wandeling.findById(id);
    if (!wandeling.auteur.equals(req.user._id)) {
        req.flash('error', 'Je hebt geen toestemming voor deze handeling.');
        return res.redirect(`/wandelingen/${id}`);
    }
    next();
};

module.exports.isAuteurRecensie = async (req, res, next) => {
    const { id, recensieId } = req.params;
    const recensie = await Recensie.findById(recensieId);
    if (!recensie.auteur.equals(req.user._id)) {
        req.flash('error', 'Je hebt geen toestemming voor deze handeling.');
        return res.redirect(`/wandelingen/${id}`);
    }
    next();
};

module.exports.validateRecensie = (req, res, next) => {
    const { error } = recensieSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};