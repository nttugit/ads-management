import express from 'express';
const router = express.Router();
import billboardTypeController from '../controllers/billboardType.controller.js';
import departmentStaffAuth from '../middlewares/departmentStaffAuth.mdw.js';

// Lấy danh sách
router.get('/', departmentStaffAuth, billboardTypeController.getBillboardTypes);
// Lấy thông tin chi tiết
router.get(
    '/:id',
    departmentStaffAuth,
    billboardTypeController.getBillboardType,
);
// Tạo
router.post(
    '/',
    departmentStaffAuth,
    billboardTypeController.postBillboardType,
);
// Cập nhật
router.patch(
    '/:id',
    departmentStaffAuth,
    billboardTypeController.patchBillboardType,
);
// Xoá
router.delete(
    '/:id',
    departmentStaffAuth,
    billboardTypeController.deleteBillboardType,
);

export default router;
