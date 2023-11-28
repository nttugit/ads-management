const handler = {};
import Model from '../models/adsCategory.model.js';

handler.getAdsCategories = async (
    condition = {},
    projection = {},
    pagination = { size: 10, page: 1 },
) => {
    const skip = pagination.page * pagination.size - pagination.size;

    const adCategories = await Model.find(condition, projection)
        .skip(skip)
        .limit(pagination.size);

    return adCategories;
};

handler.getAdsCategoryById = async (id, projection = {}) => {
    return Model.findById(id, projection);
};

handler.count = async (condition = {}) => {
    return Model.countDocuments(condition);
};

handler.createAdsCategory = async (data) => {
    return Model.create(data);
};

handler.updateAdsCategory = async (id, data) => {
    // Cập nhật và trả về dữ liệu mới được cập nhật
    return Model.findOneAndUpdate({ _id: id }, data);
};

handler.deleteAdsCategory = async (id) => {
    // Xoá nhưng vẫn trả về dữ liệu bị xoá
    return Model.findOneAndDelete({ _id: id });
};

export default handler;
