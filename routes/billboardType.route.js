import express from 'express';
const router = express.Router();
import billboardTypeController from '../controllers/billboardType.controller.js';

// Lấy danh sách địa điểm đặt quảng cáo
router.get('/', billboardTypeController.getBillboardTypes);
// Lấy thông tin chi tiết
router.get('/:id', billboardTypeController.getBillboardType);
// Tạo
router.post('/', billboardTypeController.postBillboardType);
// Cập nhật
router.patch('/:id', billboardTypeController.patchBillboardType);
// Xoá
router.delete('/:id', billboardTypeController.deleteBillboardType);

export default router;
