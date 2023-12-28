import express from 'express';
const router = express.Router();
import authController from '../controllers/auth.controller.js';
import { staffSchema } from '../constants/schema.js';
import validate from '../middlewares/validate.mdw.js';
import departmentStaffAuth from '../middlewares/departmentStaffAuth.mdw.js';

// router.post('/', authController.register);

// CANBO_SO: Tạo tài khoản cho các cán bộ phường, quận
router.post(
    '/create',
    departmentStaffAuth,
    validate(staffSchema),
    authController.createNewAccount,
);

// CANBO_SO: Phân công khu vực quản lý
router.post(
    '/assign-role',
    departmentStaffAuth,
    validate(staffSchema),
    departmentStaffAuth,
    authController.assignRole,
);

// Đăng nhập
router.post('/login', validate(staffSchema), authController.login);
// router.post('/', authController.forgotPassword);

export default router;
