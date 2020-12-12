const Wandeling = require('../models/wandeling');
const { cloudinary } = require('../cloudinary');

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
    console.log(req.body);
    const wandeling = await Wandeling.findByIdAndUpdate(id, { ...req.body.wandeling });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    wandeling.plaatjes.push(...imgs);
    await wandeling.save();
    if (req.body.wisPlaatjes) {
        for (let filename of req.body.wisPlaatjes) {
            await cloudinary.uploader.destroy(filename);
        }
        await wandeling.updateOne({ $pull: { plaatjes: { filename: { $in: req.body.wisPlaatjes } } } });
    };
    req.flash('success', 'Wandeling gewijzigd!');
    res.redirect(`/wandelingen/${wandeling._id}`)
};

module.exports.wisWandeling = async (req, res) => {
    const { id } = req.params;
    await Wandeling.findByIdAndDelete(id);
    req.flash('success', 'Wandeling gewist!');
    res.redirect('/wandelingen');
};