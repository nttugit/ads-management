import express from 'express';
const router = express.Router();
import controller from '../controllers/adsLocation.controller.js';

// Lấy danh sách địa điểm đặt quảng cáo
router.get('/', controller.getAdsLocations);
// Lấy thông tin chi tiết
router.get('/:id', controller.getAdsLocation);
// Tạo
router.post('/', controller.postAdsLocation);
// Cập nhật
router.patch('/:id', controller.patchAdsLocation);
// Xoá
router.delete('/:id', controller.deleteAdsLocation);

export default router;
