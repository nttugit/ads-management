import express from 'express';
const router = express.Router();
import adsCategoryController from '../controllers/adsCategory.controller.js';

// Lấy danh sách địa điểm đặt quảng cáo
router.get('/', adsCategoryController.getAdsCategories);
// Lấy thông tin chi tiết
router.get('/:id', adsCategoryController.getAdsCategory);
// Tạo
router.post('/', adsCategoryController.postAdsCategory);
// Cập nhật
router.patch('/:id', adsCategoryController.patchAdsCategory);
// Xoá
router.delete('/:id', adsCategoryController.deleteAdsCategory);

export default router;
