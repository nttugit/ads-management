import express from 'express';
const router = express.Router();
import controller from '../controllers/adsRequest.controller.js';
import staffAuth from '../middlewares/staffAuth.mdw.js';
// import wardStaffAuthMdw from '../middlewares/wardStaffAuth.mdw.js';
// import departmentStaffAuth from '../middlewares/departmentStaffAuth.mdw.js';
import { upload, resizeAndSaveImages } from '../utils/image.js';

// ============== BIỂN QUẢNG CÁO ===============

// // [CÁN BỘ SỞ] Lấy danh sách theo phường quận
router.get('/', controller.getAdsRequests);

// [CÁN BỘ QUẬN/PHƯỜNG] Lấy danh sách yêu cầu của chính mình đã gửi
router.get('/mine', staffAuth, controller.getMyAdsRequests);

// Lấy thông tin chi tiết
router.get('/:id', controller.getAdsRequest);

// [CÁN BỘ PHƯỜNG/QUẬN] Tạo yêu cầu cấp phép cho BQC
router.post(
    '/',
    staffAuth,
    upload.array('images'),
    resizeAndSaveImages,
    controller.postAdsRequest,
);

// [CÁN BỘ SỞ]: Xét duyệt yêu cầu chỉnh sửa (cập nhật trạng thái thôi)
router.patch('/:id', staffAuth, controller.patchAdsRequest);

// [CÁN BỘ SỞ]: Xét duyệt yêu cầu chỉnh sửa (cập nhật trạng thái thôi)
// router.patch('/ads/:id', departmentStaffAuth, controller.patchAdsEditRequest);
export default router;
