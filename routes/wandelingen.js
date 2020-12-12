const express = require('express');
const router = express.Router();
const wrapAsync = require('../helpers/wrapAsync');
const Wandeling = require('../models/wandeling');
const wandelingen = require('../controllers/wandelingController');
const { isIngelogd, validateWandeling, isAuteur } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(wrapAsync(wandelingen.index))
    .post(isIngelogd, upload.array('plaatje'), validateWandeling, wrapAsync(wandelingen.maakWandeling));


router.get('/new', isIngelogd, wandelingen.renderNewForm);

router.route('/:id')
    .get(wrapAsync(wandelingen.toonWandeling))
    .put(isIngelogd, isAuteur, validateWandeling, wrapAsync(wandelingen.wijzigWandeling))
    .delete(isIngelogd, isAuteur, wrapAsync(wandelingen.wisWandeling));

router.get('/:id/edit', isIngelogd, isAuteur, wrapAsync(wandelingen.renderEditForm));

module.exports = router;