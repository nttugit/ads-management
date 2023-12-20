import express from 'express';
const router = express.Router();
import authController from '../controllers/auth.controller.js';
import { staffSchema } from '../constants/schema.js';
import validate from '../middlewares/validate.mdw.js';

// router.post('/', authController.register);

// Tạo tài khoản cho các cán bộ phường, quận
router.post('/create', validate(staffSchema), authController.createNewAccount);
// Đăng nhập
router.post('/login', validate(staffSchema), authController.login);
// router.post('/', authController.forgotPassword);

export default router;
