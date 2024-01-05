import RESPONSE from '../constants/response.js';
import AdsEditRequestHandler from '../handlers/adsEditRequest.handler.js';
import AdsHandler from '../handlers/ads.handler.js';
// import AdsLocationHandler from '../handlers/adsLocation.handler.js';
import AdsLocationEditRequestHandler from '../handlers/adsLocationEditRequest.handler.js';
import AddressHandler from '../handlers/address.handler.js';
const adsEditRequestHandler = new AdsEditRequestHandler();
const adsLocationEditRequestHandler = new AdsLocationEditRequestHandler();
const addressHandler = new AddressHandler();
const adsHandler = new AdsHandler();
// const adsLocationHandler = new AdsLocationHandler();
const controller = {};

// ============ ADS EDIT REQUEST
controller.getAdsEditRequests = async (req, res) => {
    const { size = 50, page = 1, wards = [], districts = [] } = req.query;
    const conditions = {};
    const pagination = { size, page };
    const populate = [
        { path: 'ads' },
        { path: 'sender', select: 'fullName phone email' },
    ];

    if (typeof districts === 'string') {
        conditions['district'] = { $in: districts.split(';;') };
        if (typeof wards === 'string')
            conditions['ward'] = { $in: wards.split(';;') };
    }

    const data = await adsEditRequestHandler.getList(
        conditions,
        {},
        pagination,
        populate,
    );

    const totalItems = await adsEditRequestHandler.count(conditions);

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

controller.getMyAdsEditRequests = async (req, res) => {
    const { size = 50, page = 1 } = req.query;
    const conditions = {};
    const pagination = { size, page };
    const populate = [
        { path: 'ads' },
        { path: 'sender', select: 'fullName phone email' },
    ];
    conditions['sender'] = req.staff._id;
    // const { district = null, ward = null } = req.staff.assigned;
    // if (district) {
    //     conditions['district'] = { $in: [district] };
    //     if (ward) conditions['ward'] = { $in: [ward] };
    // }
    // console.log('conditions:', conditions);
    const data = await adsEditRequestHandler.getList(
        conditions,
        {},
        pagination,
        populate,
    );

    const totalItems = await adsEditRequestHandler.count(conditions);
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

controller.getAdsEditRequest = async (req, res) => {
    const { id } = req.params;
    const populate = [
        { path: 'ads' },
        { path: 'sender', select: 'fullName phone email' },
    ];

    const result = await adsEditRequestHandler.getById(id, {}, populate);
    if (!result) return res.status(204).send();
    res.status(200).json(RESPONSE.SUCCESS(result, 'get sucessfully'));
};

controller.postAdsEditRequest = async (req, res) => {
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

    const adsWard = ads.adsLocation.address.ward._id;
    const adsDistrict = ads.adsLocation.address.district._id;

    if (ward.toString() != adsWard.toString()) {
        if (district.toString() != adsDistrict.toString())
            return res
                .status(403)
                .json(
                    RESPONSE.FAILURE(
                        403,
                        'unauthorized (bien quang cao nay khong thuoc pham vi quan ly cua ban)',
                    ),
                );
    }
    data.sender = req.staff._id;
    const imageIds = req.imageIds || [];
    if (imageIds.length > 0) {
        data.images = imageIds;
    }
    data.district = district;
    data.ward = ward;

    const result = await adsEditRequestHandler.create(data);
    res.status(200).json(RESPONSE.SUCCESS(result, 'created'));
};

controller.patchAdsEditRequest = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const populate = [
        { path: 'ads' },
        { path: 'sender', select: 'fullName phone email' },
    ];

    const result = await adsEditRequestHandler.updateAndReturn(
        { _id: id },
        { status },
        {},
        populate,
    );
    res.status(200).json(RESPONSE.SUCCESS(result, 'update sucessfully'));
};

// ============ ADS LOCATION EDIT REQUEST
controller.getAdsLocationEditRequests = async (req, res) => {
    const { size = 50, page = 1, wards = [], districts = [] } = req.query;

    const conditions = {};
    const pagination = { size, page };
    const populate = [
        { path: 'adsLocation' },
        { path: 'sender', select: 'fullName phone email' },
    ];

    if (typeof districts === 'string') {
        conditions['district'] = { $in: districts.split(';;') };
        if (typeof wards === 'string')
            conditions['ward'] = { $in: wards.split(';;') };
    }

    const data = await adsLocationEditRequestHandler.getList(
        conditions,
        {},
        pagination,
        populate,
    );
    const totalItems = await adsLocationEditRequestHandler.count(conditions);
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

controller.getMyAdsLocationEditRequests = async (req, res) => {
    const { size = 50, page = 1 } = req.query;

    const conditions = {};
    const pagination = { size, page };
    const populate = [
        { path: 'adsLocation' },
        { path: 'sender', select: 'fullName phone email' },
    ];
    conditions['sender'] = req.staff._id;

    const data = await adsLocationEditRequestHandler.getList(
        conditions,
        {},
        pagination,
        populate,
    );
    const totalItems = await adsLocationEditRequestHandler.count(conditions);
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

controller.getAdsLocationEditRequest = async (req, res) => {
    const { id } = req.params;
    const populate = [
        { path: 'adsLocation' },
        { path: 'sender', select: 'fullName phone email' },
    ];

    const result = await adsLocationEditRequestHandler.getById(
        id,
        {},
        populate,
    );
    if (!result) return res.status(204).send();
    res.status(200).json(RESPONSE.SUCCESS(result, 'get sucessfully'));
};

controller.postAdsLocationEditRequest = async (req, res) => {
    // Todo: validate
    const data = req.body;
    const { district: staffDistrict = null, ward: staffWard } =
        req.staff.assigned;
    const {
        lat,
        long,
        streetLine1,
        streetLine2,
        ward,
        district,
        city,
        country,
    } = data;
    // Tạo thông tin địa chỉ
    const addressData = {
        lat,
        long,
        streetLine1,
        streetLine2,
        ward,
        district,
        city,
        country,
    };
    // Neu co address
    let address = null;
    if (lat) {
        address = await addressHandler.create(addressData);
        // if (!address)
        //     return res
        //         .status(400)
        //         .json(RESPONSE.FAILURE(400, 'bad address data'));
    }

    if (address) data['address'] = address._id;
    data.sender = req.staff._id;
    data.district = staffDistrict;
    data.ward = staffWard;

    const result = await adsLocationEditRequestHandler.create(data);
    res.status(200).json(RESPONSE.SUCCESS(result, 'created'));
};

controller.patchAdsLocationEditRequest = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const populate = [
        { path: 'adsLocation' },
        { path: 'sender', select: 'fullName phone email' },
    ];

    const result = await adsLocationEditRequestHandler.updateAndReturn(
        { _id: id },
        { status },
        {},
        populate,
    );
    res.status(200).json(RESPONSE.SUCCESS(result, 'update sucessfully'));
};

export default controller;
