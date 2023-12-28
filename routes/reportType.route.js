import express from 'express';
const router = express.Router();
import controller from '../controllers/reportType.controller.js';
import validate from '../middlewares/validate.mdw.js';
import { reportTypeSchema } from '../constants/schema.js';
import departmentStaffAuth from '../middlewares/departmentStaffAuth.mdw.js';
// Lấy danh sách
router.get('/', departmentStaffAuth, controller.getReportTypes);
// Lấy thông tin chi tiết
router.get('/:id', departmentStaffAuth, controller.getReportType);
// Tạo
router.post(
    '/',
    departmentStaffAuth,
    validate(reportTypeSchema),
    controller.postReportType,
);
// Cập nhật
router.patch(
    '/:id',
    departmentStaffAuth,
    validate(reportTypeSchema),
    controller.patchReportType,
);
// Xoá
router.delete('/:id', departmentStaffAuth, controller.deleteReportType);

export default router;
