const handler = {};
import Model from '../models/billboardType.model.js';

handler.getBillboardTypes = async (
    condition = {},
    projection = {},
    pagination = { size: 10, page: 1 },
) => {
    const skip = pagination.page * pagination.size - pagination.size;

    const billboardTypes = await Model.find(condition, projection)
        .skip(skip)
        .limit(pagination.size);

    return billboardTypes;
};

handler.getBillboardTypeById = async (id, projection = {}) => {
    return Model.findById(id, projection);
};

handler.count = async (condition = {}) => {
    return Model.countDocuments(condition);
};

handler.createBillboardType = async (data) => {
    return Model.create(data);
};

handler.updateBillboardType = async (id, data) => {
    // Cập nhật và trả về dữ liệu mới được cập nhật
    return Model.findOneAndUpdate({ _id: id }, data);
};

handler.deleteBillboardType = async (id) => {
    // Xoá nhưng vẫn trả về dữ liệu bị xoá
    return Model.findOneAndDelete({ _id: id });
};

export default handler;
