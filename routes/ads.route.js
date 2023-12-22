import express from 'express';
const router = express.Router();
import controller from '../controllers/ads.controller.js';
import { upload, resizeAndSaveImages } from '../utils/image.js';

// Lấy danh sách
router.get('/', controller.getAdsList);

router.get('/list', controller.getAdsList);

// // Lấy thông tin chi tiết
router.get('/:id', controller.getAds);
// Tạo
router.post(
    '/',
    upload.array('images'),
    resizeAndSaveImages,
    controller.postAds,
);
// // Cập nhật
router.patch(
    '/:id',
    upload.array('images'),
    resizeAndSaveImages,
    controller.patchAds,
);
// Xoá
// router.delete('/:id', controller.deleteAds);

export default router;
