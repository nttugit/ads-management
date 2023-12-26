import RESPONSE from '../constants/response.js';
import Handler from '../handlers/ward.handler.js';
import StaffHandler from '../handlers/staff.handler.js';
import DistrictHandler from '../handlers/district.handler.js';
const handler = new Handler();
const districtHandler = new DistrictHandler();
const staffHandler = new StaffHandler();
const controller = {};

controller.getWards = async (req, res) => {
    const { size = 50, page = 1 } = req.query;
    const conditions = {};
    const pagination = { size, page };
    const populate = [
        {
            path: 'district',
            select: 'name',
        },
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

controller.getWard = async (req, res) => {
    const { id } = req.params;
    const populate = [
        {
            path: 'district',
            select: 'name',
        },
    ];
    const ward = await handler.getById(id, {}, populate);
    // Nhớ return khi muốn kết thúc
    if (!ward) return res.status(204).send();
    res.status(200).json(RESPONSE.SUCCESS(ward, 'get sucessfully'));
};

controller.postWard = async (req, res) => {
    const data = req.body;

    const district = await districtHandler.getById(data.district, '_id');
    if (!district)
        return res
            .status(400)
            .json(RESPONSE.FAILURE(400, 'district not found'));
    const newWard = await handler.create(data);
    res.status(200).json(RESPONSE.SUCCESS(newWard, 'created'));
};

controller.patchWard = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    // Nếu có bổ nhiệm cán bộ thì cập nhật ngày bổ nhiệm và role cho cán bộ đó
    // if (data?.staff) {
    //     data['appointmentDate'] = new Date();
    //     await staffHandler.updateById(data.staff, {
    //         role: 'canbo_phuong',
    //     });
    // }
    const updatedDistrict = await handler.updateById(id, data);

    res.status(200).json(RESPONSE.SUCCESS(updatedDistrict, 'updated'));
};

controller.deleteWard = async (req, res) => {
    const { id } = req.params;
    const deletedWard = await handler.deleteById(id);
    res.status(200).json(RESPONSE.SUCCESS(deletedWard, 'deleted'));
};

export default controller;
