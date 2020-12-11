const express = require('express');
const router = express.Router();
const wrapAsync = require('../helpers/wrapAsync');
const Wandeling = require('../models/wandeling');
const { isIngelogd, validateWandeling, isAuteur } = require('../middleware');



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
    const wandeling = await Wandeling.findById(req.params.id).populate({
        path: 'recensies',
        populate: {
            path: 'auteur'
        }
    }).populate('auteur');
    console.log(wandeling);
    console.log(wandeling.auteur)
    if (!wandeling) {
        req.flash('error', 'Helaas, de wandeling is niet gevonden...');
        return res.redirect('/wandelingen');
    }
    res.render('wandelingen/show', { wandeling });
}));

router.get('/:id/edit', isIngelogd, isAuteur, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const wandeling = await Wandeling.findById(id);
    if (!wandeling) {
        req.flash('error', 'Helaas, de wandeling is niet gevonden...');
        return res.redirect('/wandelingen');
    }
    res.render('wandelingen/edit', { wandeling });
}));

router.put('/:id', isIngelogd, isAuteur, validateWandeling, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const wandeling = await Wandeling.findByIdAndUpdate(id, { ...req.body.wandeling });
    req.flash('success', 'Wandeling gewijzigd!');
    res.redirect(`/wandelingen/${wandeling._id}`)
}));

router.delete('/:id', isIngelogd, isAuteur, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Wandeling.findByIdAndDelete(id);
    req.flash('success', 'Wandeling gewist!');
    res.redirect('/wandelingen');
}));

module.exports = router;