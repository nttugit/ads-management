import express from 'express';
const router = express.Router();
import controller from '../controllers/adsLocation.controller.js';
import departmentStaffAuth from '../middlewares/departmentStaffAuth.mdw.js';

// Lấy danh sách
router.get('/', controller.getAdsLocations);
// Lấy thông tin chi tiết
router.get('/:id', controller.getAdsLocation);
// Tạo
router.post('/', departmentStaffAuth, controller.postAdsLocation);
// Cập nhật
router.patch('/:id', departmentStaffAuth, controller.patchAdsLocation);
// Xoá
router.delete('/:id', departmentStaffAuth, controller.deleteAdsLocation);

export default router;
