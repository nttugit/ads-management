import RESPONSE from '../constants/response.js';
import AdsEditRequestHandler from '../handlers/adsEditRequest.handler.js';
import AdsLocationEditRequestHandler from '../handlers/adsLocationEditRequest.handler.js';
import AddressHandler from '../handlers/address.handler.js';
const adsEditRequestHandler = new AdsEditRequestHandler();
const adsLocationEditRequestHandler = new AdsLocationEditRequestHandler();
const addressHandler = new AddressHandler();
const controller = {};

// ============ ADS EDIT REQUEST
controller.getAdsEditRequests = async (req, res) => {
    const { size = 50, page = 1 } = req.query;
    const conditions = {};
    const pagination = { size, page };
    const populate = [
        { path: 'ads' },
        { path: 'sender', select: 'fullName phone email' },
    ];

    const data = await adsEditRequestHandler.getList(
        conditions,
        {},
        pagination,
        populate,
    );
    const totalItems = await adsEditRequestHandler.count(conditions);
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
    const data = req.body;
    data.sender = req.staff._id;
    const imageIds = req.imageIds || [];
    if (imageIds.length > 0) {
        data.images = imageIds;
    }

    const result = await adsEditRequestHandler.create(data);
    res.status(200).json(RESPONSE.SUCCESS(result, 'created'));
};

// ============ ADS LOCATION EDIT REQUEST
controller.getAdsLocationEditRequests = async (req, res) => {
    const { size = 50, page = 1 } = req.query;
    const conditions = {};
    const pagination = { size, page };
    const populate = [
        { path: 'adsLocation' },
        { path: 'sender', select: 'fullName phone email' },
    ];

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
    const result = await adsLocationEditRequestHandler.create(data);
    res.status(200).json(RESPONSE.SUCCESS(result, 'created'));
};

// controller.patchAdsCategory = async (req, res) => {
//     // Todo: validate
//     const { id } = req.params;
//     const data = req.body;
//     const updatedAdsCategory = await handler.updateById(id, data);
//     res.status(200).json(RESPONSE.SUCCESS(updatedAdsCategory, 'updated'));
// };

// controller.deleteAdsCategory = async (req, res) => {
//     const { id } = req.params;
//     const deletedAdsCategory = await handler.deleteById(id);
//     res.status(200).json(RESPONSE.SUCCESS(deletedAdsCategory, 'deleted'));
// };

export default controller;
