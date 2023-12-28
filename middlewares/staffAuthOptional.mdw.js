import { ROLES } from '../constants/auth.js';
import StaffModel from '../models/staff.model.js';
import { verifyToken } from '../utils/auth.js';

export default async (req, res, next) => {
    // Kiểm tra nếu có xác thực thì tốt, không thì thôi (optional)
    const authorizationHeader = req.headers['authorization'];
    const accessToken = authorizationHeader?.split(' ')[1];
    let staff = null;
    if (accessToken) {
        const verified = verifyToken(accessToken);
        console.log('verified', verified);
        if (verified) {
            if (ROLES.STAFF.includes(verified?.role)) {
                staff = await StaffModel.findOne(
                    {
                        username: verified.username,
                    },
                    'username role assigned',
                );
            }
        }
    }

    req.staff = staff;
    next();
};
