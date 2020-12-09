const express = require('express');
const passport = require('passport');
const router = express.Router();
const wrapAsync = require('../helpers/wrapAsync');
const Gebruiker = require('../models/gebruiker');

router.get('/inschrijven', (req, res) => {
    res.render('gebruikers/inschrijven');
});

router.post('/inschrijven', wrapAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const gebruiker = new Gebruiker({ email, username });
        const ingeschrevenGebruiker = await Gebruiker.register(gebruiker, password);
        req.login(ingeschrevenGebruiker, err => {
            if (err) return next(err);
            req.flash('success', 'Welkom bij de WandelApp, nieuwe wandelaar!');
            res.redirect('/wandelingen');
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/inschrijven')
    }
}));

router.get('/inloggen', (req, res) => {
    res.render('gebruikers/inloggen');
});

router.post('/inloggen', passport.authenticate('local', { failureFlash: true, failureRedirect: '/inschrijven' }), (req, res) => {
    req.flash('success', 'Welkom terug, wandelaar!');
    const redirectUrl = req.session.returnTo || '/wandelingen';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

router.get('/uitloggen', (req, res) => {
    req.logout();
    req.flash('success', ('Tabee, wandelaar!'))
    res.redirect('/wandelingen');
})

module.exports = router;