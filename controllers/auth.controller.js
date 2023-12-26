import RESPONSE from '../constants/response.js';
import Handler from '../handlers/auth.handler.js';
import WardHandler from '../handlers/ward.handler.js';
import DistrictHandler from '../handlers/district.handler.js';
import { SALT_ROUNDS } from '../constants/auth.js';
import {
    generateToken,
    verifyToken,
    generateRefreshToken,
    verifyRefreshToken,
    hashPassword,
    comparePassword,
} from '../utils/auth.js';

const handler = new Handler();
const wardHandler = new WardHandler();
const districtHandler = new DistrictHandler();
const controller = {};

// controller.register = async (req, res) => {
//     // Todo: validate
//     const data = req.body;
//     const newStaff = await handler.create(data);
//     res.status(200).json(RESPONSE.SUCCESS(newStaff, 'created'));
// };

controller.createNewAccount = async (req, res) => {
    // Todo: validate
    /**
     * username: lowercase
     */
    /**
     * 1. Kiểm tra tồn tại username
     * 2. Hash password
     * 3. Lưu và trả về dữ liệu (projection)
     *
     * Note: có cần kiểm tra trùng email và phone không?
     */
    const data = req.body;
    const exist = await handler.getOne({ username: data.username }, { _id: 1 });
    if (exist)
        return res.status(400).json(RESPONSE.FAILURE(400, 'username exists'));

    const hashedPassword = hashPassword(data.password);
    data.password = hashedPassword;
    if (data?.assigned) {
        if (data.assigned?.ward) {
            // phan cong phuong
            data['role'] = 'canbo_phuong';
        } else {
            // phan cong quan
            data['role'] = 'canbo_quan';
        }
        data['assigned']['appointmentDate'] = new Date();
    }

    const newStaff = (await handler.create(data)).toObject();
    if (newStaff?.role === 'canbo_phuong') {
        await wardHandler.updateById(data.assigned?.ward, {
            staff: newStaff._id,
        });
    } else if (newStaff?.role === 'canbo_quan') {
        await districtHandler.updateById(newStaff.assigned.district, {
            staff: newStaff._id,
        });
    }
    delete newStaff['password'];
    delete newStaff['refreshToken'];
    res.status(201).json(RESPONSE.SUCCESS(newStaff, 'created'));
};

controller.assignRole = async (req, res) => {
    // Todo: validate
    /**
     * username: lowercase
     */
    /**
     * 1. Kiểm tra tồn tại username
     * 2. Hash password
     * 3. Lưu và trả về dữ liệu (projection)
     *
     * Note: có cần kiểm tra trùng email và phone không?
     */
    const data = req.body;
    const exist = await handler.getOne({ username: data.username }, { _id: 1 });
    if (exist)
        return res.status(400).json(RESPONSE.FAILURE(400, 'username exists'));

    const hashedPassword = hashPassword(data.password);
    data.password = hashedPassword;
    const newStaff = await handler.create(data);
    res.status(201).json(RESPONSE.SUCCESS(newStaff, 'created'));
};

controller.login = async (req, res) => {
    // Todo: validate
    const { username, password } = req.body;
    const staff = await handler.getOne(
        { username },
        'username password role assigned refreshToken',
    );
    if (!staff)
        return res.status(400).json(RESPONSE.FAILURE(400, 'user not found'));
    if (!comparePassword(password, staff.password))
        return res
            .status(400)
            .json(RESPONSE.FAILURE(400, 'Invalid username or password'));
    const accessTokenData = {
        username,
        role: staff.role,
        assigned: staff.assigned,
    };
    const accessToken = generateToken(accessTokenData);
    let refreshToken = null;
    // Nếu đã có refresh token thì trả về cái đó, còn không thì tạo mới
    if (!staff.refreshToken) {
        refreshToken = generateRefreshToken(accessTokenData);
        await handler.updateById(staff._id, { refreshToken });
    } else {
        refreshToken = staff.refreshToken;
    }

    delete staff.password;
    res.status(200).json(
        RESPONSE.SUCCESS(
            {
                accessToken,
                refreshToken,
                staff: {
                    _id: staff._id,
                    username: staff.username,
                    role: staff.role,
                    assigned: staff.assigned,
                },
            },
            'login successfully',
        ),
    );
};

export default controller;
