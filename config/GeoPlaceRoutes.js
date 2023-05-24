const express = require('express');
const router = express.Router();
const GeoPlaceController = require('../app/controllers/GeoPlaceController');

// Rotas para lugares
router.get('/places', GeoPlaceController.listPlaces);
router.post('/places', GeoPlaceController.createPlace);
router.get('/places/:id', GeoPlaceController.getPlace);
router.put('/places/:id', GeoPlaceController.updatePlace);
router.delete('/places/:id', GeoPlaceController.deletePlace);

// Rotas para áreas
router.get('/areas', GeoPlaceController.listAreas);
router.post('/areas', GeoPlaceController.createArea);
router.get('/areas/:id', GeoPlaceController.getArea);
router.put('/areas/:id', GeoPlaceController.updateArea);
router.delete('/areas/:id', GeoPlaceController.deleteArea);

// Rotas adicionais
router.get('/places/:placeId/:areaId', GeoPlaceController.checkPlaceInArea);
router.get('/areas/:areaId/places', GeoPlaceController.listPlacesInArea);

module.exports = router;
