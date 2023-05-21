const express = require('express');
const router = express.Router();
const placesController = require('../app/controllers/placesController');

router.get('/places', placesController.getAllPlaces);

router.get('/places/:id', placesController.getPlaceById);

module.exports = router;
