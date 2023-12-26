import RESPONSE from '../constants/response.js';
import ImageHandler from '../handlers/image.handler.js';
import { removeImages } from '../utils/image.js';

import ReportHandler from '../handlers/report.handler.js';
import AdsHandler from '../handlers/ads.handler.js';
import AdsLocationHandler from '../handlers/adsLocation.handler.js';
import AdsReportHandler from '../handlers/adsReport.handler.js';
import AdsLocationReportHandler from '../handlers/adsLocationReport.handler.js';

const reportHandler = new ReportHandler();
const adsHandler = new AdsHandler();
const adsLocationHandler = new AdsLocationHandler();
const adsReportHandler = new AdsReportHandler();
const adsLocationReportHandler = new AdsLocationReportHandler();

const imageHandler = new ImageHandler();
const controller = {};

controller.getAdsReports = async (req, res) => {
    const { size = 50, page = 1, districts = [], wards = [] } = req.query;
    const conditions = {};
    const pagination = { size, page };
    // #todo: Giới hạn select fields
    const populate = [
        {
            path: 'report',
            select: '-_id',
            populate: [
                { path: 'images', select: '-_id' },
                {
                    path: 'reportType',
                    select: '-_id',
                },
            ],
        },
        { path: 'ads', select: '-_id' },
    ];
    if (districts.length > 0) {
        conditions['district'] = { $in: districts.split(';;') };
        if (wards.length > 0) conditions['ward'] = { $in: wards.split(';;') };
    }
    // console.log('conditions:', conditions);
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
    const { size = 50, page = 1, districts = [], wards = [] } = req.query;
    const conditions = {};
    const pagination = { size, page };
    const populate = [
        {
            path: 'report',
            select: '-_id',
            populate: [
                { path: 'reportType', select: '-_id' },
                {
                    path: 'images',
                    select: '-_id -report',
                },
            ],
        },
        {
            path: 'adsLocation',
            select: '-_id -createdAt -updatedAt',
            populate: [
                {
                    path: 'address',
                    populate: [
                        { path: 'ward', select: 'name -_id' },
                        { path: 'district', select: 'name -_id' },
                    ],
                },
                {
                    path: 'locationType',
                    select: '-_id',
                },
                {
                    path: 'adsCategory',
                    select: '-_id',
                },
            ],
        },
    ];
    if (districts.length > 0) {
        conditions['district'] = { $in: districts.split(';;') };
        if (wards.length > 0) conditions['ward'] = { $in: wards.split(';;') };
    }
    const data = await adsLocationReportHandler.getList(
        conditions,
        {},
        pagination,
        populate,
    );
    const totalItems = await adsLocationReportHandler.count(conditions);
  
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
        {
            path: 'report',
            select: '-_id',
            populate: [
                { path: 'images', select: '-_id' },
                {
                    path: 'reportType',
                    select: '-_id',
                },
            ],
        },
        {
            path: 'ads',
            select: '-_id',
        },
    ];

    const adsReport = await adsReportHandler.getById(id, {}, populate);
    // Nhớ return khi muốn kết thúc
    if (!adsReport) return res.status(204).send();
    res.status(200).json(RESPONSE.SUCCESS(adsReport, 'get sucessfully'));
};

controller.getAdsLocationReport = async (req, res) => {
    const { id } = req.params;
    const populate = [
        {
            path: 'report',
            select: '-_id',
            populate: [
                { path: 'reportType', select: '-_id' },
                {
                    path: 'images',
                    select: '-_id -report',
                },
            ],
        },
        {
            path: 'adsLocation',
            select: '-_id -createdAt -updatedAt',
            populate: [
                {
                    path: 'address',
                    populate: [
                        { path: 'ward', select: 'name -_id' },
                        { path: 'district', select: 'name -_id' },
                    ],
                },
                {
                    path: 'locationType',
                    select: '-_id',
                },
                {
                    path: 'adsCategory',
                    select: '-_id',
                },
            ],
        },
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
     * 3. Thêm phường/quận cho report luôn cho tiện truy vấn kkk
     */
    // Todo: validate
    const { adsId, reportType, fullName, email, phone, content } = req.body;
    const ads = await adsHandler.getById(
        adsId,
        {
            adsLocation: 1,
        },
        [
            {
                path: 'adsLocation',
                select: 'address',
                populate: [
                    {
                        path: 'address',
                        select: 'district ward',
                        populate: [
                            { path: 'district', select: '_id' },
                            { path: 'ward', select: '_id' },
                        ],
                    },
                ],
            },
        ],
    );
    if (!ads)
        return res.status(400).json(RESPONSE.FAILURE(400, 'ads not found'));
    // return res.json(ads);
    const imageIds = req.imageIds || [];
    // if (imageIds.length > 0) {
    //     data.images = imageIds;
    // }

    const populate = [
        {
            path: 'images',
            select: '-_id',
        },
        {
            path: 'reportType',
            select: '-_id',
        },
    ];
    // Tạo report
    const reportData = {
        reportType,
        fullName,
        email,
        phone,
        content,
        images: imageIds,
    };
    const newReport = await reportHandler.createAndReturn(
        reportData,
        {},
        populate,
    );
    if (!newReport)
        res.status(400).json(RESPONSE.FAILURE(400, 'something wrong'));
    // console.log('newReport', newReport);
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
            ward: ads.adsLocation.address.ward._id,
            district: ads.adsLocation.address.district._id,
        }),
    ]);

    res.status(201).json(
        RESPONSE.SUCCESS(
            {
                report: newReport,
                adsReport: newAdsReport,
            },
            'create successfully',
        ),
    );
};

controller.postAdsLocationReport = async (req, res) => {
    /**
     * 1. Tạo report
     * 2. Cập nhật Ads Location Report và Image
     *
     */
    // Todo: validate
    const { adsLocationId, reportType, fullName, email, phone, content } =
        req.body;
    const adsLocation = await adsLocationHandler.getById(
        adsLocationId,
        {
            address: 1,
        },
        [
            {
                path: 'address',
                select: 'district ward',
                populate: [
                    { path: 'district', select: '_id' },
                    { path: 'ward', select: '_id' },
                ],
            },
        ],
    );
    if (!adsLocation)
        return res.status(400).json(RESPONSE.FAILURE(400, 'ads not found'));
    const imageIds = req.imageIds || [];

    // Tạo report
    const newReport = await reportHandler.createAndReturn(
        {
            reportType,
            fullName,
            email,
            phone,
            content,
            images: imageIds,
        },
        {},
        [
            {
                path: 'images',
                select: '-_id',
            },
            {
                path: 'reportType',
                select: '-_id',
            },
        ],
    );
    if (!newReport)
        res.status(400).json(RESPONSE.FAILURE(400, 'something wrong'));

    // Cập nhật ảnh thuộc report này và tạo mới Ads Report
    const [updateImage, newAdsLocationReport] = await Promise.all([
        imageHandler.updateMany(
            { _id: { $in: imageIds } },
            {
                report: newReport._id,
            },
        ),
        adsLocationReportHandler.create({
            report: newReport._id,
            adsLocation: adsLocationId,
            ward: adsLocation.address.ward._id,
            district: adsLocation.address.district._id,
        }),
    ]);

    res.status(201).json(
        RESPONSE.SUCCESS(
            {
                report: newReport,
                adsLocationReport: newAdsLocationReport,
            },
            'create successfully',
        ),
    );
};

export default controller;
