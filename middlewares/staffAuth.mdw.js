import RESPONSE from '../constants/response.js';
import { ROLES } from '../constants/auth.js';
import StaffModel from '../models/staff.model.js';
import { verifyToken } from '../utils/auth.js';

export default async (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    const accessToken = authorizationHeader?.split(' ')[1];
    if (!accessToken)
        return res.status(401).json(RESPONSE.FAILURE(401, 'Access denied'));

    // Verify token
    const verified = verifyToken(accessToken);
    if (!verified) {
        return res.status(401).json(RESPONSE.FAILURE(401, 'Access denied'));
    }

    // Kiểm tra có quyền cán bộ không
    if (!ROLES.STAFF.includes(verified?.role))
        return res.status(403).json(RESPONSE.FAILURE(403, 'Unauthorized'));

    const staff = await StaffModel.findOne(
        {
            username: verified.username,
        },
        'username role assigned',
    );
    req.staff = staff;

    next();
};

// console.log(
//     generateToken({
//         username: 'hehe',
//     }),
// );

// console.log(
//     verifyToken(
//         'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImhlaGUiLCJpYXQiOjE3MDMwMDUzNzUsImV4cCI6MTcwMzg2OTM3NX0.Bf7HX4K0VQPGUesqzvccUi-P55KmdGhklgFp0xNQYSg',
//     ),
// );
