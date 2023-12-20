import express from 'express';
const router = express.Router();
import controller from '../controllers/adsCategory.controller.js';

// Lấy danh sách
router.get('/', controller.getAdsCategories);
// Lấy thông tin chi tiết
router.get('/:id', controller.getAdsCategory);
// Tạo
router.post('/', controller.postAdsCategory);
// Cập nhật
router.patch('/:id', controller.patchAdsCategory);
// Xoá
router.delete('/:id', controller.deleteAdsCategory);

export default router;
