module.exports.isIngelogd = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Je moet ingelogd zijn om dat te kunnen doen...')
        return res.redirect('/inloggen');
    }
    next();
};