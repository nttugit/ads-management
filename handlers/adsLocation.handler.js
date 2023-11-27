const handler = {};
import Model from '../models/adsLocation.model.js';

handler.getAdsLocations = async (
    condition = {},
    projection = {},
    pagination = { size: 10, page: 1 },
) => {
    const skip = pagination.page * pagination.size - pagination.size;

    const adsLocations = await Model.find(condition, projection)
        .skip(skip)
        .limit(pagination.size);

    return adsLocations;
};

handler.count = async (condition = {}) => {
    return Model.countDocuments(condition);
};

export default handler;
