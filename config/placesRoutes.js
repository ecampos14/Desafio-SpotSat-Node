const express = require('express');
const router = express.Router();
const placesPartIIController = require('../app/controllers/placesPartIIController');

router.get('/', placesPartIIController.getAllPlaces);

router.post('/', placesPartIIController.createPlace);

router.put('/:id', placesPartIIController.updatePlace);

router.delete('/:id', placesPartIIController.deletePlace);

module.exports = router;
