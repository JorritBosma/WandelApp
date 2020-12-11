const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateRecensie, isIngelogd, isAuteurRecensie } = require('../middleware')
const Wandeling = require('../models/wandeling');
const Recensie = require('../models/recensie');
const wrapAsync = require('../helpers/wrapAsync');
const ExpressError = require('../helpers/ExpressError');
const recensies = require('../controllers/recensieController');

router.post('/', isIngelogd, validateRecensie, wrapAsync(recensies.maakRecensie));

router.delete('/:recensieId', isIngelogd, isAuteurRecensie, wrapAsync(recensies.wisRecensie));

module.exports = router;