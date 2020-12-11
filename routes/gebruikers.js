const express = require('express');
const passport = require('passport');
const router = express.Router();
const wrapAsync = require('../helpers/wrapAsync');
const Gebruiker = require('../models/gebruiker');
const gebruikers = require('../controllers/gebruikersController');

router.get('/inschrijven', gebruikers.renderInschrijfForm);

router.post('/inschrijven', wrapAsync(gebruikers.maakGebruiker));

router.get('/inloggen', gebruikers.renderInlogscherm);

router.post('/inloggen',
    passport.authenticate
        ('local', { failureFlash: true, failureRedirect: '/inschrijven' }),
    gebruikers.login);

router.get('/uitloggen', gebruikers.loguit);

module.exports = router;