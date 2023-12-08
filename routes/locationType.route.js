import express from 'express';
const router = express.Router();
import controller from '../controllers/locationType.controller.js';

// Lấy danh sách địa điểm đặt quảng cáo
router.get('/', controller.getLocationTypes);
// Lấy thông tin chi tiết
router.get('/:id', controller.getLocationType);
// Tạo
router.post('/', controller.postLocationType);
// Cập nhật
router.patch('/:id', controller.patchLocationType);
// Xoá
router.delete('/:id', controller.deleteLocationType);

export default router;
