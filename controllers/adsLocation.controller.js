import RESPONSE from '../constants/response.js';

import handler from '../handlers/adsLocation.handler.js';

const controller = {};

controller.getAdsLocations = async (req, res) => {
    const { size = 10, page = 1 } = req.query;
    const condition = {};
    const data = await handler.getAdsLocations(condition);
    const totalItems = await handler.count(condition);
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

export default controller;
