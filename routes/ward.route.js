import express from 'express';
const router = express.Router();
import controller from '../controllers/ward.controller.js';
import { wardSchema } from '../constants/schema.js';
import validate from '../middlewares/validate.mdw.js';

// Lấy danh sách
router.get('/', controller.getWards);
// Lấy thông tin chi tiết
router.get('/:id', controller.getWard);
// Tạo
router.post('/', validate(wardSchema), controller.postWard);
// Cập nhật
router.patch('/:id', validate(wardSchema), controller.patchWard);
// Xoá
router.delete('/:id', controller.deleteWard);

export default router;
