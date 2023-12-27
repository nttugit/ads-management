import express from 'express';
const router = express.Router();
import controller from '../controllers/adsCategory.controller.js';
import departmentStaffAuth from '../middlewares/departmentStaffAuth.mdw.js';

// Lấy danh sách
router.get('/', departmentStaffAuth, controller.getAdsCategories);
// Lấy thông tin chi tiết
router.get('/:id', departmentStaffAuth, controller.getAdsCategory);
// Tạo
router.post('/', departmentStaffAuth, controller.postAdsCategory);
// Cập nhật
router.patch('/:id', departmentStaffAuth, controller.patchAdsCategory);
// Xoá
router.delete('/:id', departmentStaffAuth, controller.deleteAdsCategory);

export default router;
