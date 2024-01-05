import RESPONSE from '../constants/response.js';
import AdsRequestHandler from '../handlers/adsRequest.handler.js';
import AdsHandler from '../handlers/ads.handler.js';
// import AdsLocationHandler from '../handlers/adsLocation.handler.js';
import AdsLocationEditRequestHandler from '../handlers/adsLocationEditRequest.handler.js';
import AddressHandler from '../handlers/address.handler.js';
const adsRequestHandler = new AdsRequestHandler();
const adsLocationEditRequestHandler = new AdsLocationEditRequestHandler();
const addressHandler = new AddressHandler();
const adsHandler = new AdsHandler();
// const adsLocationHandler = new AdsLocationHandler();
const controller = {};

// ============ ADS EDIT REQUEST

controller.getAdsRequests = async (req, res) => {
    const { size = 50, page = 1, wards = [], districts = [] } = req.query;
    const conditions = {};
    const pagination = { size, page };
    const populate = [
        { path: 'ads', select: '-editVersion', populate: [{ path: 'images' }] },
        { path: 'sender', select: 'fullName phone email' },
        {
            path: 'adsLocation',
            populate: [
                {
                    path: 'address',
                    populate: [{ path: 'ward' }, { path: 'district' }],
                },
            ],
        },
    ];

    if (typeof districts === 'string') {
        conditions['district'] = { $in: districts.split(';;') };
        if (typeof wards === 'string')
            conditions['ward'] = { $in: wards.split(';;') };
    }
    console.log('conditions', conditions);
    const data = await adsRequestHandler.getList(
        conditions,
        {},
        pagination,
        populate,
    );

    const totalItems = await adsRequestHandler.count(conditions);

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

controller.getMyAdsRequests = async (req, res) => {
    const { size = 50, page = 1 } = req.query;
    const conditions = {};
    const pagination = { size, page };
    const populate = [
        { path: 'ads', select: '-editVersion', populate: [{ path: 'images' }] },
        { path: 'sender', select: 'fullName phone email' },
        {
            path: 'adsLocation',
            populate: [
                {
                    path: 'address',
                    populate: [{ path: 'ward' }, { path: 'district' }],
                },
            ],
        },
    ];

    const staffId = req.staff._id;
    conditions['sender'] = staffId;

    const data = await adsRequestHandler.getList(
        conditions,
        {},
        pagination,
        populate,
    );

    const totalItems = await adsRequestHandler.count(conditions);
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

controller.getAdsRequest = async (req, res) => {
    const { id } = req.params;
    const populate = [
        { path: 'ads', select: '-editVersion', populate: [{ path: 'images' }] },
        { path: 'sender', select: 'fullName phone email' },
        {
            path: 'adsLocation',
            populate: [
                {
                    path: 'address',
                    populate: [{ path: 'ward' }, { path: 'district' }],
                },
            ],
        },
    ];

    const result = await adsRequestHandler.getById(id, {}, populate);
    if (!result) return res.status(204).send();
    res.status(200).json(RESPONSE.SUCCESS(result, 'get sucessfully'));
};

controller.postAdsRequest = async (req, res) => {
    // Todo: validate
    // Kiểm tra BQC có thuộc quận/phường của cán bộ này không?
    const data = req.body;
    const { district = null, ward = null } = req.staff.assigned;
    const ads = await adsHandler.getById(req.body.ads, {}, [
        {
            path: 'adsLocation',
            select: 'address',
            populate: [
                {
                    path: 'address',
                    select: 'ward district',
                    populate: [
                        { path: 'ward', select: '_id' },
                        { path: 'district', select: '_id' },
                    ],
                },
            ],
        },
    ]);

    if (!ads)
        return res.status(400).json(RESPONSE.FAILURE(400, 'ads not found'));

    // const adsWard = ads.adsLocation.address.ward._id;
    // const adsDistrict = ads.adsLocation.address.district._id;

    // if (ward.toString() != adsWard.toString()) {
    //     if (district.toString() != adsDistrict.toString())
    //         return res
    //             .status(403)
    //             .json(
    //                 RESPONSE.FAILURE(
    //                     403,
    //                     'unauthorized (bien quang cao nay khong thuoc pham vi quan ly cua ban)',
    //                 ),
    //             );
    // }
    data.sender = req.staff._id;
    const imageIds = req.imageIds || [];
    if (imageIds.length > 0) {
        data.images = imageIds;
    }
    data.district = district;
    data.ward = ward;
    data.adsLocation = ads.adsLocation._id;
    // return res.status(200).json(RESPONSE.SUCCESS(data, 'created'));
    const result = await adsRequestHandler.create(data);
    res.status(200).json(RESPONSE.SUCCESS(result, 'created'));
};

controller.patchAdsRequest = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const populate = [
        { path: 'ads', select: '-editVersion', populate: [{ path: 'images' }] },
        { path: 'sender', select: 'fullName phone email' },
        {
            path: 'adsLocation',
            populate: [
                {
                    path: 'address',
                    populate: [{ path: 'ward' }, { path: 'district' }],
                },
            ],
        },
    ];

    const result = await adsRequestHandler.updateAndReturn(
        { _id: id },
        { status },
        {},
        populate,
    );
    res.status(200).json(RESPONSE.SUCCESS(result, 'update sucessfully'));
};

export default controller;
