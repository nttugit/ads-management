import RESPONSE from '../constants/response.js';
import Handler from '../handlers/staff.handler.js';
import WardHandler from '../handlers/ward.handler.js';
import DistrictHandler from '../handlers/district.handler.js';
import { hashPassword } from '../utils/auth.js';
const handler = new Handler();
const wardHandler = new WardHandler();
const districtHandler = new DistrictHandler();
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
    /**
     *  1. Cập nhật staff.asigned
     *  2. Xoá staff id khỏi ward.staffs hoặc district.staffs CŨ
     *  3. Thêm staff id khỏi ward.staffs hoặc district.staffs MỚI
     *  3. Xong
     */
    // staff id
    const { id } = req.params;
    const staff = await handler.getById(id, { _id: 1, assigned: 1 });

    if (!staff)
        return res.status(400).json(RESPONSE.FAILURE(400, 'staff not found'));

    // Phường/Quận cũ
    const { district: formerDistrict, ward: formerWard } = staff.assigned;

    // Gỡ bỏ thông tin cán bộ ở QUẬN/PHƯỜNG cũ
    [] = await Promise.all([
        districtHandler.updateById(formerDistrict, {
            $pull: {
                staffs: id,
            },
        }),
        wardHandler.updateById(formerWard, {
            $pull: {
                staffs: id,
            },
        }),
    ]);
    // Phường/Quận mới
    const { district = null, ward = null } = req.body;
    let staffResp = null;
    const data = {};
    data['assigned'] = { district, ward, appointmentDate: new Date() };

    const projection = '-password -refreshToken -createdAt -updatedAt';

    if (ward) {
        data['role'] = 'canbo_phuong';

        [staffResp] = await Promise.all([
            handler.updateAndReturn(
                {
                    _id: id,
                },
                data,
                projection,
            ),
            wardHandler.updateById(ward, {
                $push: {
                    staffs: id,
                },
            }),
        ]);
    } else {
        if (district) {
            data['role'] = 'canbo_quan';
            [staffResp] = await Promise.all([
                handler.updateAndReturn(
                    {
                        _id: id,
                    },
                    data,
                    projection,
                ),
                districtHandler.updateById(district, {
                    $push: {
                        staffs: ward,
                    },
                }),
            ]);
        }
    }

    res.status(200).json(RESPONSE.SUCCESS(staffResp, 'update sucessfully'));
};

export default controller;
