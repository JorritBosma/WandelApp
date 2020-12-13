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
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo')(session);

const gebruikerRoutes = require('./routes/gebruikers');
const wandelingRoutes = require('./routes/wandelingen');
const recensieRoutes = require('./routes/recensies');
const { allowedNodeEnvironmentFlags } = require('process');

// Paste in dbUrl in mongoose.connect to connect to Atlas.
// const dbUrl = process.env.DB_URL;
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/wandelapp';
mongoose.connect(dbUrl, {
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
app.use(mongoSanitize());

const secret = process.env.SECRET || 'ikbenheelgeheim!';

const store = new MongoStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
});

const sessionConfig = {
    store,
    name: 'zitting',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
}
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dc5aih2mm/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LokaleStrategie(Gebruiker.authenticate()));

passport.serializeUser(Gebruiker.serializeUser());
passport.deserializeUser(Gebruiker.deserializeUser());

app.use((req, res, next) => {
    // console.log(req.query);
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

const port = process.env.PORT || 8080
app.listen(port, (req, res) => {
    console.log(`Poortje ${port} luistert weer mensen!!!`)
});