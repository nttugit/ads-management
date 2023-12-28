import express from 'express';
const router = express.Router();
import controller from '../controllers/editRequest.controller.js';
import wardStaffAuthMdw from '../middlewares/wardStaffAuth.mdw.js';
import { upload, resizeAndSaveImages } from '../utils/image.js';

// Lấy danh sách
router.get('/ads', controller.getAdsEditRequests);

// Lấy thông tin chi tiết
router.get('/ads/:id', controller.getAdsEditRequest);

// Tạo Edit request cho BQC
router.post(
    '/ads',
    wardStaffAuthMdw,
    upload.array('images'),
    resizeAndSaveImages,
    controller.postAdsEditRequest,
);

router.get('/ads-location', controller.getAdsLocationEditRequests);
router.get('/ads-location/:id', controller.getAdsLocationEditRequest);

// Tạo Edit request cho ĐĐ
router.post(
    '/ads-location',
    wardStaffAuthMdw,
    controller.postAdsLocationEditRequest,
);

// Cập nhật
// router.patch('/:id', controller.patchAdsCategory);
// Xoá
// router.delete('/:id', controller.deleteAdsCategory);

export default router;
