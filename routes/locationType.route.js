import express from 'express';
const router = express.Router();
import controller from '../controllers/locationType.controller.js';
import departmentStaffAuth from '../middlewares/departmentStaffAuth.mdw.js';
// Lấy danh sách
router.get('/', departmentStaffAuth, controller.getLocationTypes);
// Lấy thông tin chi tiết
router.get('/:id', controller.getLocationType);
// Tạo
router.post('/', departmentStaffAuth, controller.postLocationType);
// Cập nhật
router.patch('/:id', departmentStaffAuth, controller.patchLocationType);
// Xoá
router.delete('/:id', departmentStaffAuth, controller.deleteLocationType);

export default router;
