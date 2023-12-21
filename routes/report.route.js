import express from 'express';
const router = express.Router();
import controller from '../controllers/report.controller.js';
import { upload, resizeAndSaveImages } from '../utils/image.js';

// BÁO CÁO BIỂN QUẢNG CÁO (Ads Report)

// Lấy danh sách báo cáo biển quảng cáo (BQC)
router.get('/ads', controller.getAdsReports);
// Lấy chi tiết báo cáo BQC
router.get('/ads/:id', controller.getAdsReport);
// Tạo báo cáo cho BQC
router.post(
    '/ads',
    upload.array('images'),
    resizeAndSaveImages,
    controller.postAdsReport,
);

// BÁO CÁO ĐỊA ĐIỂM ĐẶT (Ads Locatio Report)

// router.post(
//     '/ads-location/:id',
//     // upload.array('images'),
//     // resizeAndSaveImages,
//     controller.postAds,
// );
// // Cập nhật
// router.patch(
//     '/:id',
//     upload.array('images'),
//     resizeAndSaveImages,
//     controller.patchAds,
// );
// // Xoá
// router.delete('/:id', controller.deleteAds);

export default router;
