import express from 'express';
const router = express.Router();
import adsLocationController from '../controllers/adsLocation.controller.js';

// Lấy danh sách địa điểm đặt quảng cáo
router.get('/', adsLocationController.getAdsLocations);

export default router;
