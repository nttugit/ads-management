import express from 'express';
const router = express.Router();
import controller from '../controllers/report.controller.js';
import { upload, resizeAndSaveImages } from '../utils/image.js';
import staffAuthOptional from '../middlewares/staffAuthOptional.mdw.js';
import wardStaffAuth from '../middlewares/wardStaffAuth.mdw.js';
import staffAuth from '../middlewares/staffAuth.mdw.js';

// ======== BÁO CÁO BIỂN QUẢNG CÁO (Ads Report)

// [CHỈ DÀNH CHO CÁN BỘ] - lấy danh sách báo cáo theo sở, quận, phường
router.get('/ads', staffAuthOptional, controller.getAdsReports);

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
// Cán bộ PHƯỜNG/QUẬN cập nhật tình trạng báo cáo
router.patch('/ads/:id', staffAuth, controller.patchAdsReport);

// ======== BÁO CÁO ĐỊA ĐIỂM ĐẶT (Ads Locatio Report)

// Lấy danh sách báo cáo điểm đặt
router.get('/ads-location', controller.getAdsLocationReports);

// Lấy thông tin chi tiết
router.get('/ads-location/:id', controller.getAdsLocationReport);

// Tạo báo cáo cho Điểm đặt
router.post(
    '/ads-location',
    upload.array('images'),
    resizeAndSaveImages,
    controller.postAdsLocationReport,
);

export default router;
