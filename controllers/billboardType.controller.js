import RESPONSE from '../constants/response.js';
import handler from '../handlers/billboardType.handler.js';

const controller = {};

controller.getBillboardTypes = async (req, res) => {
    const { size = 10, page = 1 } = req.query;
    const condition = {};
    const data = await handler.getBillboardTypes(condition)
    const totalItems = await handler.count(condition);
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

controller.getBillboardType = async (req, res) => {
    const { id } = req.params;
    const BillboardType = await handler.getBillboardTypeById(id);
    // Nhớ return khi muốn kết thúc
    if (!BillboardType) return res.status(204).send();
    res.status(200).json(RESPONSE.SUCCESS(BillboardType, 'get sucessfully'));
};

controller.postBillboardType = async (req, res) => {
    // Todo: validate
    const data = req.body;
    const newBillboardType = await handler.createBillboardType(data);
    res.status(200).json(RESPONSE.SUCCESS(newBillboardType, 'created'));
};

controller.patchBillboardType = async (req, res) => {
    // Todo: validate
    const { id } = req.params;
    const data = req.body;
    const updatedBillboardType = await handler.updateBillboardType(id, data);
    res.status(200).json(RESPONSE.SUCCESS(updatedBillboardType, 'updated'));
};

controller.deleteBillboardType = async (req, res) => {
    const { id } = req.params;
    const deletedBillboardType = await handler.deleteBillboardType(id);
    res.status(200).json(RESPONSE.SUCCESS(deletedBillboardType, 'deleted'));
};

export default controller;
