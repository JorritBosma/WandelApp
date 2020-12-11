const express = require('express');
const passport = require('passport');
const router = express.Router();
const wrapAsync = require('../helpers/wrapAsync');
const Gebruiker = require('../models/gebruiker');
const gebruikers = require('../controllers/gebruikersController');

router.route('/inschrijven')
    .get(gebruikers.renderInschrijfForm)
    .post(wrapAsync(gebruikers.maakGebruiker))

router.route('/inloggen')
    .get(gebruikers.renderInlogscherm)
    .post(passport.authenticate
        ('local', { failureFlash: true, failureRedirect: '/inschrijven' }),
        gebruikers.login)

router.get('/uitloggen', gebruikers.loguit);

module.exports = router;