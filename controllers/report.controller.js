import RESPONSE from '../constants/response.js';
import ImageHandler from '../handlers/image.handler.js';
import { removeImages } from '../utils/image.js';
import { sendEmail, createReportEmailContent } from '../utils/email.js';
import { EMAIL_TITLES, REPORT_STATUS } from '../constants/email.js';
import ReportHandler from '../handlers/report.handler.js';
import AdsHandler from '../handlers/ads.handler.js';
import AdsLocationHandler from '../handlers/adsLocation.handler.js';
import AdsReportHandler from '../handlers/adsReport.handler.js';
import AdsLocationReportHandler from '../handlers/adsLocationReport.handler.js';
import ReportSolutionHandler from '../handlers/reportSolution.handler.js';
const reportHandler = new ReportHandler();
const adsHandler = new AdsHandler();
const adsLocationHandler = new AdsLocationHandler();
const adsReportHandler = new AdsReportHandler();
const adsLocationReportHandler = new AdsLocationReportHandler();
const reportSolutionHandler = new ReportSolutionHandler();

const imageHandler = new ImageHandler();
const controller = {};
// ========================= ADS REPORT =========================
controller.getAdsReports = async (req, res) => {
    const {
        size = 50,
        page = 1,
        districts = [],
        wards = [],
        guestId = '',
        status = -99,
    } = req.query;
    let districtCondition = [],
        wardCondition = [];

    const conditions = {};
    const pagination = { size, page };

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

    // Nếu phân quyền cán bộ
    const staff = req.staff;
    if (req.staff) {
        // #todo: nếu chưa phân phường thì sao??? -> thì không có báo cáo thôi
        // Nếu cán bộ có role này thì lấy dữ liệu phường đó
        if (staff.role == 'canbo_phuong' && staff.assigned.ward)
            wardCondition.push(staff.assigned.ward);
        // Nếu cán bộ có role này thì lấy dữ liệu quận đó
        if (staff.role == 'canbo_quan' && staff.assigned.district) {
            districtCondition.push(staff.assigned.district);
        } else if (staff.role == 'canbo_so') {
            // Lấy hết
        } else {
            // Nếu cán bộ chưa được phân công sẽ không thấy gì
            return res
                .status(200)
                .json(RESPONSE.SUCCESS([], 'get sucessfully'));
        }

        if (typeof districts === 'string')
            districtCondition.push(...districts.split(';;'));
        if (typeof wards === 'string') wardCondition.push(...wards.split(';;'));

        if (districtCondition.length > 0)
            conditions['district'] = { $in: districtCondition };
        if (wardCondition.length > 0)
            conditions['ward'] = { $in: wardCondition };
    } else {
        if (!guestId) {
            return res
                .status(200)
                .json(RESPONSE.SUCCESS([], 'get sucessfully'));
        }
        // Nếu người dân (xem danh sách báo cáo của chính mình)
        conditions['guestId'] = guestId;
    }

    if (status !== -99) conditions['status'] = status;
    console.log('conditions:', conditions);

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

controller.postAdsReport = async (req, res) => {
    /**
     * 1. Tạo report
     * 2. Cập nhật Ads Report và Image
     * 3. Thêm phường/quận cho report luôn cho tiện truy vấn kkk
     */
    // Todo: validate
    const {
        adsId,
        reportType,
        fullName,
        email,
        phone,
        content,
        guestId = '',
    } = req.body;
    // Kiểm tra spam báo cáo
    const existingReport = await adsReportHandler.getOne(
        { ads: adsId, guestId },
        { _id: 1 },
    );
    if (existingReport)
        return res.status(400).json(RESPONSE.FAILURE(400, 'report exists'));

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
                        populate: [{ path: 'district' }, { path: 'ward' }],
                    },
                ],
            },
        ],
    );
    if (!ads)
        return res.status(400).json(RESPONSE.FAILURE(400, 'ads not found'));

    const imageIds = req.imageIds || [];
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
    const ward = ads.adsLocation.address.ward;
    const district = ads.adsLocation.address.district;

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
            ward: ward._id,
            district: district._id,
            guestId,
        }),
    ]);

    if (newAdsReport) {
        const reportSolution = await reportSolutionHandler.getOne({ ward });
        const content = createReportEmailContent(
            fullName,
            ward.name,
            district.name,
            reportSolution.solution,
        );
        await sendEmail(email, EMAIL_TITLES.ADS, content);
    }

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

// ========================= ADS LOCATION REPORT =========================
controller.getAdsLocationReports = async (req, res) => {
    const {
        size = 50,
        page = 1,
        districts = [],
        wards = [],
        guestId = '',
        status = -99,
    } = req.query;
    const conditions = {};
    let districtCondition = [],
        wardCondition = [];
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

    // Nếu phân quyền cán bộ
    const staff = req.staff;
    console.log(staff.assigned.ward);
    if (staff) {
        // Nếu cán bộ có role này thì lấy dữ liệu phường đó
        if (staff.role == 'canbo_phuong' && staff.assigned.ward)
            wardCondition.push(staff.assigned.ward);
        // Nếu cán bộ có role này thì lấy dữ liệu quận đó
        if (staff.role == 'canbo_quan' && staff.assigned.district) {
            districtCondition.push(staff.assigned.district);
        } else if (staff.role == 'canbo_so') {
            // Lấy hết
        } else {
            // Nếu cán bộ chưa được phân công sẽ không thấy gì
            return res
                .status(200)
                .json(RESPONSE.SUCCESS([], 'get sucessfully'));
        }

        // Nếu có truyền dữ liệu filter lên
        if (typeof districts === 'string')
            districtCondition.push(...districts.split(';;'));
        if (typeof wards === 'string') wardCondition.push(...wards.split(';;'));
        console.log('districtCondition', districtCondition);
        console.log('wardCondition', wardCondition);
        if (districtCondition.length > 0)
            conditions['district'] = { $in: districtCondition };
        if (wardCondition.length > 0)
            conditions['ward'] = { $in: wardCondition };
    } else {
        if (!guestId) {
            return res
                .status(200)
                .json(RESPONSE.SUCCESS([], 'get sucessfully'));
        }
        // Nếu người dân (xem danh sách báo cáo của chính mình)
        conditions['guestId'] = guestId;
    }

    if (status !== -99) conditions['status'] = status;
    console.log('conditions:', conditions);

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

controller.postAdsLocationReport = async (req, res) => {
    /**
     * 1. Tạo report
     * 2. Cập nhật Ads Location Report và Image
     * 3. Thêm phường/quận cho report luôn cho tiện truy vấn kkk
     */
    // Todo: validate
    const {
        adsLocationId,
        reportType,
        fullName,
        email,
        phone,
        content,
        guestId = '',
    } = req.body;

    // Kiểm tra spam báo cáo
    const existingReport = await adsLocationReportHandler.getOne(
        { adsLocation: adsLocationId, guestId },
        { _id: 1 },
    );
    if (existingReport)
        return res.status(400).json(RESPONSE.FAILURE(400, 'report exists'));

    const adsLocation = await adsLocationHandler.getById(
        adsLocationId,
        {
            address: 1,
        },
        [
            {
                path: 'address',
                select: 'district ward',
                populate: [{ path: 'district' }, { path: 'ward' }],
            },
        ],
    );
    if (!adsLocation)
        return res
            .status(400)
            .json(RESPONSE.FAILURE(400, 'ads location not found'));
    const imageIds = req.imageIds || [];
    const populate = [
        {
            path: 'images',
        },
        {
            path: 'reportType',
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

    const ward = adsLocation.address.ward;
    const district = adsLocation.address.district;

    // Cập nhật ảnh thuộc report này và tạo mới Ads Location Report
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
            ward: ward._id,
            district: district._id,
            guestId,
        }),
    ]);

    if (newAdsLocationReport) {
        const reportSolution = await reportSolutionHandler.getOne({ ward });
        const content = createReportEmailContent(
            fullName,
            ward.name,
            district.name,
            reportSolution.solution,
        );
        await sendEmail(email, EMAIL_TITLES.ADS_LOCATION, content);
    }

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

controller.patchAdsReport = async (req, res) => {
    // Kiêm tra quảng cáo phải thuộc PHƯỜNG/QUẬN của mình
    // return res.json(req.staff);
    const { assigned } = req.staff;
    const { id } = req.params;
    const { status } = req.body;

    const populate = [
        {
            path: 'report',
            select: '-_id',
            populate: [
                { path: 'images' },
                {
                    path: 'reportType',
                },
            ],
        },
        {
            path: 'ads',
        },
    ];
    const adsReport = await adsReportHandler.getById(id, {}, populate);
    if (!adsReport)
        return res
            .status(400)
            .json(RESPONSE.FAILURE(400, 'ads report not found'));

    // sai quận -> sai,
    // đúng quận -> chưa biết
    // đúng quận, sai phường -> sai
    // đúng quận, đúng phường -> đúng
    if (assigned.district.toString() !== adsReport.district.toString())
        return res.status(403).json(RESPONSE.FAILURE(403, 'unauthorized'));

    if (
        assigned.ward != null &&
        assigned.ward.toString() !== adsReport.ward.toString()
    )
        return res.status(403).json(RESPONSE.FAILURE(403, 'unauthorized'));

    const result = await adsReportHandler.updateAndReturn(
        { _id: id },
        {
            status,
        },
        {},
        populate,
    );
    if (result) {
        const content = REPORT_STATUS[status];
        // await sendEmail(adsReport.report.email, EMAIL_TITLES.ADS, content);
    }
    res.status(200).json(RESPONSE.SUCCESS(result, 'update successfully'));
};

export default controller;
