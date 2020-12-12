if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./helpers/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LokaleStrategie = require('passport-local');
const Gebruiker = require('./models/gebruiker');

const gebruikerRoutes = require('./routes/gebruikers');
const wandelingRoutes = require('./routes/wandelingen');
const recensieRoutes = require('./routes/recensies');
const { allowedNodeEnvironmentFlags } = require('process');

mongoose.connect('mongodb://localhost:27017/wandelapp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'ikbenheelgeheim!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LokaleStrategie(Gebruiker.authenticate()));

passport.serializeUser(Gebruiker.serializeUser());
passport.deserializeUser(Gebruiker.deserializeUser());

app.use((req, res, next) => {
    // console.log(req.session);
    res.locals.huidigeGebruiker = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// app.get('/nepGebruiker', async (req, res) => {
//     const gebruiker = new Gebruiker({ email: 'jorrock@gmail.com', username: "jorrock" });
//     const nieuweGebruiker = await Gebruiker.register(gebruiker, '666');
//     res.send(nieuweGebruiker);
// })

app.use('/', gebruikerRoutes);
app.use('/wandelingen', wandelingRoutes);
app.use('/wandelingen/:id/recensies', recensieRoutes);

app.get('/', (req, res) => {
    res.render('home')
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Pagina niet gevonden', 404))
});

app.use((err, req, res, nest) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh nee, er ging iets mis'
    res.status(statusCode).render('error', { err });
});

app.listen(8080, (req, res) => {
    console.log('Poortje 8080 luistert weer mensen!!!')
});