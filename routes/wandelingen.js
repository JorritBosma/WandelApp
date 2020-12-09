const express = require('express');
const router = express.Router();
const wrapAsync = require('../helpers/wrapAsync');
const ExpressError = require('../helpers/ExpressError');
const Wandeling = require('../models/wandeling');
const { wandelingSchema } = require('../schemas');
const { isIngelogd } = require('../middleware');

const validateWandeling = (req, res, next) => {
    const { error } = wandelingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

router.get('/', wrapAsync(async (req, res) => {
    const wandelingen = await Wandeling.find({});
    res.render('wandelingen/index', { wandelingen })
}));

router.get('/new', isIngelogd, (req, res) => {
    res.render('wandelingen/new');
});

router.post('/', isIngelogd, validateWandeling, wrapAsync(async (req, res, next) => {
    const wandeling = new Wandeling(req.body.wandeling);
    wandeling.auteur = req.user._id;
    await wandeling.save();
    req.flash('success', 'Nieuwe wandeling aangemaakt!');
    res.redirect(`wandelingen/${wandeling._id}`)
}));

router.get('/:id', wrapAsync(async (req, res) => {
    const wandeling = await Wandeling.findById(req.params.id).populate('recensies').populate('auteur');
    console.log(wandeling);
    console.log(wandeling.auteur)
    if (!wandeling) {
        req.flash('error', 'Helaas, de wandeling is niet gevonden...');
        return res.redirect('/wandelingen');
    }
    res.render('wandelingen/show', { wandeling });
}));

router.get('/:id/edit', isIngelogd, wrapAsync(async (req, res) => {
    const wandeling = await Wandeling.findById(req.params.id);
    if (!wandeling) {
        req.flash('error', 'Helaas, de wandeling is niet gevonden...');
        return res.redirect('/wandelingen');
    }
    res.render('wandelingen/edit', { wandeling });
}));

router.put('/:id', isIngelogd, validateWandeling, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const wandeling = await Wandeling.findByIdAndUpdate(id, { ...req.body.wandeling });
    req.flash('success', 'Wandeling gewijzigd!');
    res.redirect(`/wandelingen/${wandeling._id}`)
}));

router.delete('/:id', isIngelogd, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Wandeling.findByIdAndDelete(id);
    req.flash('success', 'Wandeling gewist!');
    res.redirect('/wandelingen');
}));

module.exports = router;