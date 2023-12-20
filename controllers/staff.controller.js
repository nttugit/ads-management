import RESPONSE from '../constants/response.js';
import Handler from '../handlers/staff.handler.js';
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
    console.log('data', data);
    console.log('req.staff', req.staff);
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

// controller.postAdsCategory = async (req, res) => {
//     // Todo: validate
//     const data = req.body;
//     const newAdsCategory = await handler.create(data);
//     res.status(200).json(RESPONSE.SUCCESS(newAdsCategory, 'created'));
// };

// controller.patchAdsCategory = async (req, res) => {
//     // Todo: validate
//     const { id } = req.params;
//     const data = req.body;
//     const updatedAdsCategory = await handler.updateById(id, data);
//     res.status(200).json(RESPONSE.SUCCESS(updatedAdsCategory, 'updated'));
// };

// controller.deleteAdsCategory = async (req, res) => {
//     const { id } = req.params;
//     const deletedAdsCategory = await handler.deleteById(id);
//     res.status(200).json(RESPONSE.SUCCESS(deletedAdsCategory, 'deleted'));
// };

export default controller;
