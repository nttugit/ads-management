import RESPONSE from '../constants/response.js';
import Handler from '../handlers/locationType.handler.js';
const handler = new Handler();
const controller = {};

controller.getLocationTypes = async (req, res) => {
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

controller.getLocationType = async (req, res) => {
    const { id } = req.params;
    const data = await handler.getById(id);
    // Nhớ return khi muốn kết thúc
    if (!data) return res.status(204).send();
    res.status(200).json(RESPONSE.SUCCESS(data, 'get sucessfully'));
};

controller.postLocationType = async (req, res) => {
    // Todo: validate
    const data = req.body;
    const newData = await handler.create(data);
    res.status(200).json(RESPONSE.SUCCESS(newData, 'created'));
};

controller.patchLocationType = async (req, res) => {
    // Todo: validate
    const { id } = req.params;
    const data = req.body;
    const updatedData = await handler.updateById(id, data);
    res.status(200).json(RESPONSE.SUCCESS(updatedData, 'updated'));
};

controller.deleteLocationType = async (req, res) => {
    const { id } = req.params;
    const deletedData = await handler.deleteById(id);
    res.status(200).json(RESPONSE.SUCCESS(deletedData, 'deleted'));
};

export default controller;
