import RESPONSE from '../constants/response.js';
import Handler from '../handlers/district.handler.js';
import StaffHandler from '../handlers/staff.handler.js';
const handler = new Handler();
const staffHandler = new StaffHandler();
const controller = {};

controller.getDistricts = async (req, res) => {
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

controller.getDistrict = async (req, res) => {
    const { id } = req.params;
    const district = await handler.getById(id, {});
    // Nhớ return khi muốn kết thúc
    if (!district) return res.status(204).send();
    res.status(200).json(RESPONSE.SUCCESS(district, 'get sucessfully'));
};

controller.postDistrict = async (req, res) => {
    const data = req.body;
    const newDistrict = await handler.create(data);
    res.status(200).json(RESPONSE.SUCCESS(newDistrict, 'created'));
};

controller.patchDistrict = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    // Nếu có bổ nhiệm cán bộ thì cập nhật ngày bổ nhiệm và role cho cán bộ đó
    // if (data?.staff) {
    //     data['appointmentDate'] = new Date();
    //     await staffHandler.updateById(data.staff, {
    //         role: 'canbo_quan',
    //     });
    // }
    const updatedDistrict = await handler.updateById(id, data);
    res.status(200).json(RESPONSE.SUCCESS(updatedDistrict, 'updated'));
};

controller.deleteDistrict = async (req, res) => {
    const { id } = req.params;
    const deletedDistrict = await handler.deleteById(id);
    res.status(200).json(RESPONSE.SUCCESS(deletedDistrict, 'deleted'));
};

export default controller;
