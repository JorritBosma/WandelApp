const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateRecensie, isIngelogd, isAuteurRecensie } = require('../middleware')
const Wandeling = require('../models/wandeling');
const Recensie = require('../models/recensie');
const wrapAsync = require('../helpers/wrapAsync');
const ExpressError = require('../helpers/ExpressError');

router.post('/', isIngelogd, validateRecensie, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const wandeling = await Wandeling.findById(id);
    const recensie = new Recensie(req.body.recensie);
    recensie.auteur = req.user._id;
    wandeling.recensies.push(recensie);
    await recensie.save();
    await wandeling.save();
    req.flash('success', 'Recensie toegevoegd!');
    res.redirect(`/wandelingen/${wandeling._id}`)
}));

router.delete('/:recensieId', isIngelogd, isAuteurRecensie, wrapAsync(async (req, res) => {
    const { id, recensieId } = req.params;
    await Wandeling.findByIdAndUpdate(id, { $pull: { recensies: recensieId } })
    await Recensie.findByIdAndDelete(recensieId);
    req.flash('success', 'Recensie gewist!');
    res.redirect(`/wandelingen/${id}`)
}));

module.exports = router;