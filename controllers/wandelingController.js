const Wandeling = require('../models/wandeling');

module.exports.index = async (req, res) => {
    const wandelingen = await Wandeling.find({});
    res.render('wandelingen/index', { wandelingen })
};

module.exports.renderNewForm = (req, res) => {
    res.render('wandelingen/new');
};

module.exports.maakWandeling = async (req, res, next) => {
    const wandeling = new Wandeling(req.body.wandeling);
    wandeling.plaatjes = req.files.map(f => ({ url: f.path, filename: f.filename }));
    wandeling.auteur = req.user._id;
    await wandeling.save();
    console.log(wandeling);
    req.flash('success', 'Nieuwe wandeling aangemaakt!');
    res.redirect(`wandelingen/${wandeling._id}`)
};

module.exports.toonWandeling = async (req, res) => {
    const wandeling = await Wandeling.findById(req.params.id).populate({
        path: 'recensies',
        populate: {
            path: 'auteur'
        }
    }).populate('auteur');
    if (!wandeling) {
        req.flash('error', 'Helaas, de wandeling is niet gevonden...');
        return res.redirect('/wandelingen');
    }
    res.render('wandelingen/show', { wandeling });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const wandeling = await Wandeling.findById(id);
    if (!wandeling) {
        req.flash('error', 'Helaas, de wandeling is niet gevonden...');
        return res.redirect('/wandelingen');
    }
    res.render('wandelingen/edit', { wandeling });
};

module.exports.wijzigWandeling = async (req, res) => {
    const { id } = req.params;
    const wandeling = await Wandeling.findByIdAndUpdate(id, { ...req.body.wandeling });
    req.flash('success', 'Wandeling gewijzigd!');
    res.redirect(`/wandelingen/${wandeling._id}`)
};

module.exports.wisWandeling = async (req, res) => {
    const { id } = req.params;
    await Wandeling.findByIdAndDelete(id);
    req.flash('success', 'Wandeling gewist!');
    res.redirect('/wandelingen');
};