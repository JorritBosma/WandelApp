const express = require('express');
const router = express.Router({ mergeParams: true });
const { recensieSchema } = require('../schemas');

const wrapAsync = require('../helpers/wrapAsync');
const ExpressError = require('../helpers/ExpressError');

const Wandeling = require('../models/wandeling');
const Recensie = require('../models/recensie');

const validateRecensie = (req, res, next) => {
    const { error } = recensieSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

router.post('/', validateRecensie, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const wandeling = await Wandeling.findById(id);
    const recensie = new Recensie(req.body.recensie);
    wandeling.recensies.push(recensie);
    await recensie.save();
    await wandeling.save();
    req.flash('success', 'Recensie toegevoegd!');
    res.redirect(`/wandelingen/${wandeling._id}`)
}));

router.delete('/:recensieId', wrapAsync(async (req, res) => {
    const { id, recensieId } = req.params;
    await Wandeling.findByIdAndUpdate(id, { $pull: { recensies: recensieId } })
    await Recensie.findByIdAndDelete(recensieId);
    req.flash('success', 'Recensie gewist!');
    res.redirect(`/wandelingen/${id}`)
}));

module.exports = router;