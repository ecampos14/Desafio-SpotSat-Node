const express = require('express');
const distanceController = require('../app/controllers/distanceController');

const router = express.Router();

router.get('/:id1/distanceto/:id2', distanceController.getDistanceBetweenPlaces);
router.get('/search', distanceController.searchPlaces);

module.exports = router;
