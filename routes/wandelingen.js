const express = require('express');
const router = express.Router();
const wrapAsync = require('../helpers/wrapAsync');
const Wandeling = require('../models/wandeling');
const wandelingen = require('../controllers/wandelingController');
const { isIngelogd, validateWandeling, isAuteur } = require('../middleware');

router.get('/', wrapAsync(wandelingen.index));

router.get('/new', isIngelogd, wandelingen.renderNewForm);

router.post('/', isIngelogd, validateWandeling, wrapAsync(wandelingen.maakWandeling));

router.get('/:id', wrapAsync(wandelingen.toonWandeling));

router.get('/:id/edit', isIngelogd, isAuteur, wrapAsync(wandelingen.renderEditForm));

router.put('/:id', isIngelogd, isAuteur, validateWandeling, wrapAsync(wandelingen.wijzigWandeling));

router.delete('/:id', isIngelogd, isAuteur, wrapAsync(wandelingen.wisWandeling));

module.exports = router;