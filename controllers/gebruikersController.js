const Gebruiker = require('../models/gebruiker');

module.exports.renderInschrijfForm = (req, res) => {
    res.render('gebruikers/inschrijven');
};

module.exports.maakGebruiker = async (req, res, next) => {
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
};

module.exports.renderInlogscherm = (req, res) => {
    res.render('gebruikers/inloggen');
};

module.exports.login = (req, res) => {
    req.flash('success', 'Welkom terug, wandelaar!');
    const redirectUrl = req.session.returnTo || '/wandelingen';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.loguit = (req, res) => {
    req.logout();
    req.flash('success', ('Tabee, wandelaar!'))
    res.redirect('/wandelingen');
};