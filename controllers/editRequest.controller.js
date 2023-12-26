import RESPONSE from '../constants/response.js';
import AdsEditRequestHandler from '../handlers/adsEditRequest.handler.js';
import AdsLocationEditRequestHandler from '../handlers/adsLocationEditRequest.handler.js';
const adsEditRequestHandler = new AdsEditRequestHandler();
const adsLocationEditRequestHandler = new AdsLocationEditRequestHandler();
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
