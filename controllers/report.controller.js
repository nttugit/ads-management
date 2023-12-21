import RESPONSE from '../constants/response.js';
import ImageHandler from '../handlers/image.handler.js';
import { removeImages } from '../utils/image.js';

import ReportHandler from '../handlers/report.handler.js';
import AdsReportHandler from '../handlers/adsReport.handler.js';
import AdsLocationReportHandler from '../handlers/adsLocationReport.handler.js';

const reportHandler = new ReportHandler();
const adsReportHandler = new AdsReportHandler();
const adsLocationReportHandler = new AdsLocationReportHandler();

const imageHandler = new ImageHandler();
const controller = {};

controller.getAdsReports = async (req, res) => {
    const { size = 50, page = 1 } = req.query;
    const conditions = {};
    const pagination = { size, page };
    // #todo: Giới hạn select fields
    const populate = [
        {
            path: 'report',
            select: '-_id',
            populate: [{ path: 'images', select: '-_id' }],
        },
        { path: 'ads', select: '-_id' },
    ];

    const data = await adsReportHandler.getList(
        conditions,
        {},
        pagination,
        populate,
    );
    const totalItems = await adsReportHandler.count(conditions);
    // const {size}
    res.status(200).json(
        RESPONSE.SUCCESS(data, 'get sucessfully', {
            pagination: {
                totalItems, // Total number of items available
                itemsPerPage: size, // Number of items per page
                currentPage: page, // The current page being returned
                totalPages: Math.ceil(totalItems / size),
            },
        }),
    );
};

controller.getAdsLocationReports = async (req, res) => {
    const { size = 50, page = 1 } = req.query;
    const conditions = {};
    const pagination = { size, page };
    const populate = [
        { path: 'report', select: '-_id' },
        { path: 'ads', select: '-_id' },
    ];

    const data = await adsLocationReportHandler.getList(
        conditions,
        {},
        pagination,
        populate,
    );
    const totalItems = await adsLocationReportHandler.count(conditions);
    // const {size}
    res.status(200).json(
        RESPONSE.SUCCESS(data, 'get sucessfully', {
            pagination: {
                totalItems, // Total number of items available
                itemsPerPage: size, // Number of items per page
                currentPage: page, // The current page being returned
                totalPages: Math.ceil(totalItems / size),
            },
        }),
    );
};

controller.getAdsReport = async (req, res) => {
    // id: id của ads report
    const { id } = req.params;
    const populate = [
        { path: 'report', select: '-_id' },
        { path: 'ads', select: '-_id' },
    ];

    const adsReport = await adsReportHandler.getById(id, {}, populate);
    // Nhớ return khi muốn kết thúc
    if (!adsReport) return res.status(204).send();
    res.status(200).json(RESPONSE.SUCCESS(adsReport, 'get sucessfully'));
};

controller.getAdsLocationReport = async (req, res) => {
    const { id } = req.params;
    const populate = [
        { path: 'report', select: '-_id' },
        { path: 'ads', select: '-_id' },
    ];

    const Ads = await adsLocationReportHandler.getById(id, {}, populate);
    // Nhớ return khi muốn kết thúc
    if (!Ads) return res.status(204).send();
    res.status(200).json(RESPONSE.SUCCESS(Ads, 'get sucessfully'));
};

controller.postAdsReport = async (req, res) => {
    /**
     * 1. Tạo report
     * 2. Cập nhật Ads Report và Image
     *
     */
    // Todo: validate
    const { adsId, reportType, fullName, email, phone, content } = req.body;
    const imageIds = req.imageIds || [];
    // if (imageIds.length > 0) {
    //     data.images = imageIds;
    // }

    // Tạo report
    const newReport = await reportHandler.create({
        reportType,
        fullName,
        email,
        phone,
        content,
        images: imageIds,
    });
    if (!newReport)
        res.status(400).json(RESPONSE.FAILURE(400, 'something wrong'));

    // Cập nhật ảnh thuộc report này và tạo mới Ads Report
    const [updateImage, newAdsReport] = await Promise.all([
        imageHandler.updateMany(
            { _id: { $in: imageIds } },
            {
                report: newReport._id,
            },
        ),
        adsReportHandler.create({
            report: newReport._id,
            ads: adsId,
        }),
    ]);

    res.status(201).json(
        RESPONSE.SUCCESS({
            report: newReport,
            adsReport: newAdsReport,
        }),
    );
};

// controller.patchAds = async (req, res) => {
//     // Todo: validate
//     const { id } = req.params;
//     const ads = await handler.getById(id, 'images');

//     if (!ads) return res.status(204).end();
//     const data = req.body;
//     const imageIds = req.imageIds || [];
//     const deletedImageIds = ads.images;
//     const deletedImagePaths = [];

//     // Nếu có ảnh thì xoá dữ liệu ảnh cũ, rồi cập nhật lại
//     if (imageIds.length > 0) {
//         data.images = imageIds;
//         const adsImages = await imageHandler.getAll({ ads: id }, { path: 1 });
//         adsImages.forEach((image) => {
//             deletedImagePaths.push(image.path.substring(2, image.path.length));
//         });
//     }

//     const populate = [
//         { path: 'billboardType', select: '-_id' },
//         { path: 'adsLocation', select: '-_id' },
//         { path: 'images', select: '-_id' },
//     ];
//     /**
//      * 1. Xoá images khỏi database
//      * 2. Xoá images khỏi uploads folder
//      * 3. Cập nhật dữ liệu mới cho ads
//      * 4. Cập nhật ads cho images
//      */
//     console.log('deletedImagePaths', deletedImagePaths);
//     const [, , updateResp] = await Promise.all([
//         // 1. Xoá ảnh cũ khỏi database
//         imageHandler.deleteMany({
//             _id: { $in: deletedImageIds },
//         }),
//         // 2. Gỡ ảnh cũ khỏi folder uploads
//         removeImages(deletedImagePaths),
//         // 3. Cập nhật dữ liệu bảng quảng cáo
//         handler.updateAndReturn({ _id: id }, data, {}, populate),
//     ]);

//     // Cập nhật lại dữ liệu ads cho mấy bức ảnh
//     if (updateResp) {
//         // Cập nhật ảnh thuộc bảng quảng cáo nào đó
//         await imageHandler.updateMany(
//             { _id: { $in: imageIds } },
//             {
//                 ads: id,
//             },
//         );
//     }

//     res.status(200).json(RESPONSE.SUCCESS(updateResp, 'updated'));
// };

// controller.deleteAds = async (req, res) => {
//     const { id } = req.params;
//     const result = await handler.deleteById(id);
//     res.status(200).json(RESPONSE.SUCCESS(result, 'deleted'));
// };

export default controller;
