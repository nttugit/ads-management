import express from 'express';
const router = express.Router();
import controller from '../controllers/district.controller.js';
import { districtSchema } from '../constants/schema.js';
import validate from '../middlewares/validate.mdw.js';

// Lấy danh sách
router.get('/', controller.getDistricts);
// Lấy thông tin chi tiết
router.get('/:id', controller.getDistrict);
// Tạo
router.post('/', validate(districtSchema), controller.postDistrict);
// Cập nhật
router.patch('/:id', validate(districtSchema), controller.patchDistrict);
// Xoá
router.delete('/:id', controller.deleteDistrict);

export default router;
