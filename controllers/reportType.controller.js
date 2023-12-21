import RESPONSE from '../constants/response.js';
import Handler from '../handlers/reportType.handler.js';
const handler = new Handler();
const controller = {};

controller.getReportTypes = async (req, res) => {
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

controller.getReportType = async (req, res) => {
    const { id } = req.params;
    const reportType = await handler.getById(id);
    // Nhớ return khi muốn kết thúc
    if (!reportType) return res.status(204).send();
    res.status(200).json(RESPONSE.SUCCESS(reportType, 'get sucessfully'));
};

controller.postReportType = async (req, res) => {
    // Todo: validate
    const data = req.body;
    const newReportType = await handler.create(data);
    res.status(200).json(RESPONSE.SUCCESS(newReportType, 'created'));
};

controller.patchReportType = async (req, res) => {
    // Todo: validate
    const { id } = req.params;
    const data = req.body;
    const updatedReportType = await handler.updateById(id, data);
    res.status(200).json(RESPONSE.SUCCESS(updatedReportType, 'updated'));
};

controller.deleteReportType = async (req, res) => {
    const { id } = req.params;
    const deletedReportType = await handler.deleteById(id);
    res.status(200).json(RESPONSE.SUCCESS(deletedReportType, 'deleted'));
};

export default controller;
