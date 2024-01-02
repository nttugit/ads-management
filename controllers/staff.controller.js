import RESPONSE from '../constants/response.js';
import Handler from '../handlers/staff.handler.js';
import { hashPassword } from '../utils/auth.js';
const handler = new Handler();
const controller = {};

controller.getStaffList = async (req, res) => {
    const { size = 50, page = 1 } = req.query;
    const conditions = {};
    const projection = '-password -refreshToken';
    const pagination = { size, page };
    const data = await handler.getList(conditions, projection, pagination);
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

controller.getAStaff = async (req, res) => {
    const { id } = req.params;
    const projection = '-password -refreshToken';
    const staff = await handler.getById(id, projection);
    // Nhớ return khi muốn kết thúc
    if (!staff) return res.status(204).send();
    res.status(200).json(RESPONSE.SUCCESS(staff, 'get sucessfully'));
};

controller.updateInfo = async (req, res) => {
    const data = req.body;
    // Nếu cập nhật mật khẩu thì cần phải hash
    if (data?.password) {
        const hashedPassword = hashPassword(data.password);
        data.password = hashedPassword;
    }
    const projection = '-password -refreshToken -createdAt -updatedAt';
    const resp = await handler.updateAndReturn(
        {
            username: req.staff.username,
        },
        data,
        projection,
    );
    res.status(200).json(RESPONSE.SUCCESS(resp, 'update sucessfully'));
};

controller.assign = async (req, res) => {
    const { id } = req.params;
    const staff = await handler.getById(id, { _id: 1 });
    if (!staff)
        return res.status(400).json(RESPONSE.FAILURE(400, 'staff not found'));

    const data = req.body;
    const projection = '-password -refreshToken -createdAt -updatedAt';
    const resp = await handler.updateAndReturn(
        {
            _id: id,
        },
        data,
        projection,
    );
    res.status(200).json(RESPONSE.SUCCESS(resp, 'update sucessfully'));
};

export default controller;
