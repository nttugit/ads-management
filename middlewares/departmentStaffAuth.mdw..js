// Middleware xác thực cán bộ sở

import RESPONSE from '../constants/response.js';
import StaffModel from '../models/staff.model.js';
import { verifyToken, generateToken } from '../utils/auth.js';
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

    if (verified?.role !== 'canbo_so')
        return res.status(403).json(RESPONSE.FAILURE(403, 'Unauthorized'));

    const staff = await StaffModel.findOne(
        {
            username: verified.username,
        },
        'username role',
    );
    req.staff = staff;

    next();
};