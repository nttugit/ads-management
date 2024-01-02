import express from 'express';
const router = express.Router();
import controller from '../controllers/map.controller.js';
// import { wardSchema } from '../constants/schema.js';
// import validate from '../middlewares/validate.mdw.js';

// Geocode
router.get('/geocode', controller.geocode);

// Reverse geocode
router.get('/reverse-geocode', controller.reverseGeocode);

export default router;
