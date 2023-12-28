import express from 'express';
const router = express.Router();
import controller from '../controllers/district.controller.js';
import { districtSchema } from '../constants/schema.js';
import validate from '../middlewares/validate.mdw.js';
import departmentStaffAuth from '../middlewares/departmentStaffAuth.mdw.js';

// Lấy danh sách
router.get('/', departmentStaffAuth, controller.getDistricts);
// Lấy thông tin chi tiết
router.get('/:id', departmentStaffAuth, controller.getDistrict);
// Tạo
router.post(
    '/',
    departmentStaffAuth,
    validate(districtSchema),
    controller.postDistrict,
);
// Cập nhật
router.patch(
    '/:id',
    departmentStaffAuth,
    validate(districtSchema),
    controller.patchDistrict,
);
// Xoá
router.delete('/:id', departmentStaffAuth, controller.deleteDistrict);

export default router;
