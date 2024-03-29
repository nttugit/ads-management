import RESPONSE from '../constants/response.js';
import Handler from '../handlers/adsCategory.handler.js';
const handler = new Handler();
const controller = {};

controller.getAdsCategories = async (req, res) => {
    const { size = 50, page = 1 } = req.query;
    const conditions = {};
    const pagination = { size, page };
    const data = await handler.getList(conditions, {}, pagination);
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

controller.getAdsCategory = async (req, res) => {
    const { id } = req.params;
    const adsCategory = await handler.getById(id);
    // Nhớ return khi muốn kết thúc
    if (!adsCategory) return res.status(204).send();
    res.status(200).json(RESPONSE.SUCCESS(adsCategory, 'get sucessfully'));
};

controller.postAdsCategory = async (req, res) => {
    // Todo: validate
    const data = req.body;
    const newAdsCategory = await handler.create(data);
    res.status(200).json(RESPONSE.SUCCESS(newAdsCategory, 'created'));
};

controller.patchAdsCategory = async (req, res) => {
    // Todo: validate
    const { id } = req.params;
    const data = req.body;
    const updatedAdsCategory = await handler.updateById(id, data);
    res.status(200).json(RESPONSE.SUCCESS(updatedAdsCategory, 'updated'));
};

controller.deleteAdsCategory = async (req, res) => {
    const { id } = req.params;
    const deletedAdsCategory = await handler.deleteById(id);
    res.status(200).json(RESPONSE.SUCCESS(deletedAdsCategory, 'deleted'));
};

export default controller;
