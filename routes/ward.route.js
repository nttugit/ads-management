import express from 'express';
const router = express.Router();
import controller from '../controllers/ward.controller.js';
import { wardSchema } from '../constants/schema.js';
import validate from '../middlewares/validate.mdw.js';
import departmentStaffAuth from '../middlewares/departmentStaffAuth.mdw.js';
// Lấy danh sách
router.get('/', departmentStaffAuth, controller.getWards);
// Lấy thông tin chi tiết
router.get('/:id', controller.getWard);
// Tạo
router.post(
    '/',
    departmentStaffAuth,
    validate(wardSchema),
    controller.postWard,
);
// Cập nhật
router.patch(
    '/:id',
    departmentStaffAuth,
    validate(wardSchema),
    controller.patchWard,
);
// Xoá
router.delete('/:id', departmentStaffAuth, controller.deleteWard);

export default router;
