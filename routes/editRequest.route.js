import express from 'express';
const router = express.Router();
import controller from '../controllers/editRequest.controller.js';
import staffAuth from '../middlewares/staffAuth.mdw.js';
import wardStaffAuthMdw from '../middlewares/wardStaffAuth.mdw.js';
import departmentStaffAuth from '../middlewares/departmentStaffAuth.mdw.js';
import { upload, resizeAndSaveImages } from '../utils/image.js';

// ============== BIỂN QUẢNG CÁO ===============

// [CÁN BỘ SỞ] Lấy danh sách yêu cầu chỉnh sửa BQC
router.get('/ads', departmentStaffAuth, controller.getAdsEditRequests);

// [CÁN BỘ QUẬN/PHƯỜNG] Lấy danh sách yêu cầu của chính mình đã gửi
router.get('/ads/mine', staffAuth, controller.getMyAdsEditRequests);

// Lấy thông tin chi tiết
router.get('/ads/:id', controller.getAdsEditRequest);

// [CÁN BỘ PHƯỜNG] Tạo Edit request cho BQC
router.post(
    '/ads',
    wardStaffAuthMdw,
    upload.array('images'),
    resizeAndSaveImages,
    controller.postAdsEditRequest,
);

// [CÁN BỘ SỞ]: Xét duyệt yêu cầu chỉnh sửa (cập nhật trạng thái thôi)
router.patch('/ads/:id', departmentStaffAuth, controller.patchAdsEditRequest);

// ============== ĐIỂM ĐẶT ===============
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
