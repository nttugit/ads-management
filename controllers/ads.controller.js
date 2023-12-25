import RESPONSE from '../constants/response.js';
import Handler from '../handlers/ads.handler.js';
import ImageHandler from '../handlers/image.handler.js';
import { removeImages } from '../utils/image.js';
const handler = new Handler();
const imageHandler = new ImageHandler();
const controller = {};

controller.getAll = async (req, res) => {
    const { size = 50, page = 1, adsLocation = '', districts = '' } = req.query;

    /**
     * Lọc danh sách bảng quảng cáo, theo:
     * - all (phân trang, cán bộ sở quản lý) - ok
     * - theo điểm đặt (adsLocation). Ex: adsLocation=6582a9e1116affc3e7dd1d4e - ok
     * - phường (ward) -
     * - nhiều phường (wards) - wards=1,2,Xuân Trung
     * - quận (district)
     * - nhiều quận (districts) - districts=1,2,Bình Thạnh
     * - điểm đặt (adsLocation)
     * - tình trạng cấp phép (status)
     *
     *
     *  Các fields nào cần lấy ra?
     */
    //
    // theo phường, quận

    const conditions = {};
    if (adsLocation) conditions['adsLocation'] = adsLocation;
    // if(districts) conditions['']
    console.log('conditions', conditions);
    const pagination = { size, page };
    const populate = [
        { path: 'billboardType', select: '-_id' },
        { path: 'adsLocation' },
        { path: 'images', select: '-_id' },
    ];

    const data = await handler.getList(conditions, {}, pagination, populate);
    const totalItems = await handler.count(conditions);
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

controller.getAdsList = async (req, res) => {
    const {
        size = 50,
        page = 1,
        adsLocation = '',
        wards = [],
        districts = [],
        status = -99,
    } = req.query;
    let data = [];
    let totalItems = 0;
    /**
     * Lọc danh sách bảng quảng cáo, theo:
     * - all (phân trang, cán bộ sở quản lý) - ok
     * - theo điểm đặt (adsLocation). Ex: adsLocation=6582a9e1116affc3e7dd1d4e - ok
     * -  phường (wards) - wards=1;;2;;Xuân Trung - ok
     * -  quận (districts) - districts=1;;2;;Bình Thạnh - ok
     * - tình trạng cấp phép (status)
     *
     *
     */
    //
    // theo phường, quận

    // Filter danh sách Ads theo location
    const pagination = { size, page };
    const populate = [
        { path: 'billboardType', select: '-_id' },
        {
            path: 'adsLocation',
            select: '-status -editVersion -createdAt -updatedAt',
            populate: [
                {
                    path: 'address',
                    select: '-_id',
                    populate: [
                        { path: 'ward', select: 'name -_id' },
                        { path: 'district', select: 'name -_id' },
                    ],
                },
                {
                    path: 'adsCategory',
                    select: '-_id',
                },
            ],
        },
        { path: 'images', select: '-_id -ads' },
    ];
    // const projection = '-status -editVersion -createdAt -updatedAt';
    const projection = {
        status: 0,
        editVersion: 0,
        createdAt: 0,
        updatedAt: 0,
    };
    const conditions = {};
    if (status != -99) conditions['status'] = status;
    // Lọc theo QUẬN, PHƯỜNG
    if (districts.length > 0) {
        conditions['districts'] = districts.split(';;');
        if (wards.length > 0) conditions['wards'] = wards.split(';;');

        data = await handler.getAdsByAreas(conditions, projection, pagination);
        totalItems = await handler.countAdsByAreas(conditions);
    } else {
        // LỌC THEO ĐỊA ĐIỂM
        if (adsLocation) conditions['adsLocation'] = adsLocation;
        data = await handler.getList(
            conditions,
            projection,
            pagination,
            populate,
        );
        totalItems = await handler.count(conditions);
    }

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

controller.getAds = async (req, res) => {
    const { id } = req.params;
    const populate = [
        { path: 'billboardType', select: '-_id' },
        {
            path: 'adsLocation',
            populate: [
                {
                    path: 'address',
                    select: '-_id',
                    populate: [
                        { path: 'ward', select: 'name -_id' },
                        { path: 'district', select: 'name -_id' },
                    ],
                },
                { path: 'adsCategory', select: '-_id' },
                { path: 'locationType', select: '-_id' },
            ],
        },
        { path: 'images', select: '-_id -ads' },
    ];

    const Ads = await handler.getById(id, {}, populate);
    // Nhớ return khi muốn kết thúc
    if (!Ads) return res.status(204).send();
    res.status(200).json(RESPONSE.SUCCESS(Ads, 'get sucessfully'));
};

controller.postAds = async (req, res) => {
    // Todo: validate
    try {
        const data = req.body;
        const imageIds = req.imageIds || [];
        if (imageIds.length > 0) {
            data.images = imageIds;
        }
        const newAds = await handler.create(data);
        if (newAds) {
            // Cập nhật ảnh thuộc bảng quảng cáo nào đó
            imageHandler.updateMany(
                { _id: { $in: imageIds } },
                {
                    ads: newAds._id,
                },
            );
        }

        res.status(200).json(RESPONSE.SUCCESS(newAds, 'created'));
    } catch (error) {
        res.status(500).json(RESPONSE.FAILURE(500, error));
    }
};

controller.patchAds = async (req, res) => {
    // Todo: validate
    try {
        const { id } = req.params;
        const ads = await handler.getById(id, 'images');

        if (!ads) return res.status(204).end();
        const data = req.body;
        const imageIds = req.imageIds || [];
        const deletedImageIds = ads.images;
        const deletedImagePaths = [];

        // Nếu có ảnh thì xoá dữ liệu ảnh cũ, rồi cập nhật lại
        if (imageIds.length > 0) {
            data.images = imageIds;
            const adsImages = await imageHandler.getAll(
                { ads: id },
                { path: 1 },
            );
            adsImages.forEach((image) => {
                deletedImagePaths.push(
                    image.path.substring(2, image.path.length),
                );
            });
        }

        const populate = [
            { path: 'billboardType', select: '-_id' },
            { path: 'adsLocation', select: '-_id' },
            { path: 'images', select: '-_id' },
        ];
        /**
         * 1. Xoá images khỏi database
         * 2. Xoá images khỏi uploads folder
         * 3. Cập nhật dữ liệu mới cho ads
         * 4. Cập nhật ads cho images
         */
        console.log('deletedImagePaths', deletedImagePaths);
        const [, , updateResp] = await Promise.all([
            // 1. Xoá ảnh cũ khỏi database
            imageHandler.deleteMany({
                _id: { $in: deletedImageIds },
            }),
            // 2. Gỡ ảnh cũ khỏi folder uploads
            removeImages(deletedImagePaths),
            // 3. Cập nhật dữ liệu bảng quảng cáo
            handler.updateAndReturn({ _id: id }, data, populate),
        ]);

        // Cập nhật lại dữ liệu ads cho mấy bức ảnh
        if (updateResp) {
            // Cập nhật ảnh thuộc bảng quảng cáo nào đó
            await imageHandler.updateMany(
                { _id: { $in: imageIds } },
                {
                    ads: id,
                },
            );
        }

        res.status(200).json(RESPONSE.SUCCESS(updateResp, 'updated'));
    } catch (error) {
        res.status(500).json(RESPONSE.FAILURE(500, error));
    }
};

// controller.deleteAds = async (req, res) => {
//     const { id } = req.params;
//     const result = await handler.deleteById(id);
//     res.status(200).json(RESPONSE.SUCCESS(result, 'deleted'));
// };

export default controller;
