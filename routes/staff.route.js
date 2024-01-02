import express from 'express';
const router = express.Router();
import controller from '../controllers/staff.controller.js';
import staffAuth from '../middlewares/staffAuth.mdw.js';
import validate from '../middlewares/validate.mdw.js';
import { selfUpdateStaffSchema } from '../constants/schema.js';
import departmentStaffAuth from '../middlewares/departmentStaffAuth.mdw.js';
// import wardStaffAuth from '../middlewares/wardStaffAuth.mdw.js';

// Lấy danh sách cán bộ
router.get('/', departmentStaffAuth, controller.getStaffList);

// Lấy thông tin chi tiết
router.get('/:id', controller.getAStaff);

// Cán bộ tự cập nhật thông tin cá nhân
router.patch(
    '/update-info',
    staffAuth,
    validate(selfUpdateStaffSchema),
    controller.updateInfo,
);

// CANBO_SO: Phân công khu vực quản lý
router.patch('/assign/:id', departmentStaffAuth, controller.assign);
export default router;
