import express from 'express';
const router = express.Router();
import controller from '../controllers/locationType.controller.js';
import departmentStaffAuth from '../middlewares/departmentStaffAuth.mdw.js';
import { locationTypeSchema } from '../constants/schema.js';
import validate from '../middlewares/validate.mdw.js';

// Lấy danh sách
router.get('/', controller.getLocationTypes);
// Lấy thông tin chi tiết
router.get('/:id', controller.getLocationType);
// Tạo
router.post(
    '/',
    departmentStaffAuth,
    validate(locationTypeSchema),
    controller.postLocationType,
);
// Cập nhật
router.patch(
    '/:id',
    departmentStaffAuth,
    validate(locationTypeSchema),
    controller.patchLocationType,
);
// Xoá
router.delete('/:id', departmentStaffAuth, controller.deleteLocationType);

export default router;
