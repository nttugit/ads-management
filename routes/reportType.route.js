import express from 'express';
const router = express.Router();
import controller from '../controllers/reportType.controller.js';
import validate from '../middlewares/validate.mdw.js';
import { reportTypeSchema } from '../constants/schema.js';

// Lấy danh sách
router.get('/', controller.getReportTypes);
// Lấy thông tin chi tiết
router.get('/:id', controller.getReportType);
// Tạo
router.post('/', validate(reportTypeSchema), controller.postReportType);
// Cập nhật
router.patch('/:id', validate(reportTypeSchema), controller.patchReportType);
// Xoá
router.delete('/:id', controller.deleteReportType);

export default router;
