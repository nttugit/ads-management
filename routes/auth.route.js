import express from 'express';
const router = express.Router();
import authController from '../controllers/auth.controller.js';
import { staffSchema, refreshTokenSchema } from '../constants/schema.js';
import validate from '../middlewares/validate.mdw.js';
import departmentStaffAuth from '../middlewares/departmentStaffAuth.mdw.js';

// CANBO_SO: Tạo tài khoản cho các cán bộ phường, quận
router.post(
    '/create',
    departmentStaffAuth,
    validate(staffSchema),
    authController.createNewAccount,
);

// Đăng nhập
router.post('/login', validate(staffSchema), authController.login);
router.post(
    '/refresh-token',
    validate(refreshTokenSchema),
    authController.refreshToken,
);
// router.post('/', authController.forgotPassword);

export default router;
