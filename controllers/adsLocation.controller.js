import RESPONSE from '../constants/response.js';
import Handler from '../handlers/adsLocation.handler.js';
import AdsHandler from '../handlers/ads.handler.js';
import AddressHandler from '../handlers/address.handler.js';

const handler = new Handler();
const adsHandler = new AdsHandler();
const addressHandler = new AddressHandler();

const controller = {};

controller.getAdsLocations = async (req, res) => {
    const {
        size = 50,
        page = 1,
        isPlanned = false, // quy hoạch
        status = -99,
        districts = [],
        wards = [],
    } = req.query;
    let data = [];
    let totalItems = 0;
    let isArea = false; // Để đánh dấu xử lý có lấy areas hay không thôi
    const conditions = {};
    const projection = {
        // status: 0,
        editVersion: 0,
        createdAt: 0,
        updatedAt: 0,
    };
    const pagination = { size, page };
    const populate = [
        {
            path: 'address',
            populate: [
                { path: 'ward', select: 'name' },
                { path: 'district', select: 'name' },
            ],
        },
        { path: 'adsCategory', select: '-_id' },
        { path: 'locationType', select: '-_id' },
    ];
    if (isPlanned) conditions['isPlanned'] = Boolean(isPlanned);
    if (status != -99) conditions['status'] = status;

    if (districts.length > 0) {
        isArea = true;
        conditions['districts'] = districts.split(';;');
        if (wards.length > 0) conditions['wards'] = wards.split(';;');
        data = await handler.getAdsLocationsByAreas(
            conditions,
            projection,
            pagination,
        );
        totalItems = await handler.countAdsLocationsByAreas(conditions);
        // totalItems=
    } else {
        // Cần trả ra danh sách số lượng biển QC
        data = await handler.getList(
            conditions,
            projection,
            pagination,
            populate,
        );
        totalItems = await handler.count(conditions);
    }

    let dataWithCountAds = await Promise.all(
        data.map(async (adsLocation) => {
            const countAds = await adsHandler.count({
                adsLocation: adsLocation._id,
            });
            const adsLocationObj = isArea
                ? adsLocation
                : adsLocation.toObject();
            adsLocationObj['countAds'] = countAds;
            return adsLocationObj;
        }),
    );

    // const {size}
    res.status(200).json(
        RESPONSE.SUCCESS(dataWithCountAds, 'get sucessfully', {
            pagination: {
                totalItems, // Total number of items available
                itemsPerPage: size, // Number of items per page
                currentPage: page, // The current page being returned
                totalPages: Math.ceil(totalItems / size),
            },
        }),
    );
};

controller.getAdsLocation = async (req, res) => {
    const { id } = req.params;
    console.log('id', id);
    const populate = [
        {
            path: 'address',
            populate: [
                { path: 'ward', select: 'name' },
                { path: 'district', select: 'name' },
            ],
        },
        { path: 'adsCategory' },
        { path: 'locationType' },
    ];
    const adsLocation = await handler.getById(id, {}, populate);
    // Nhớ return khi muốn kết thúc
    if (!adsLocation) return res.status(204).send();
    res.status(200).json(RESPONSE.SUCCESS(adsLocation, 'get sucessfully'));
};

controller.postAdsLocation = async (req, res) => {
    // Todo: validate
    const data = req.body;
    const {
        lat,
        long,
        streetLine1,
        streetLine2,
        ward,
        district,
        city,
        country,
    } = data;
    // Tạo thông tin địa chỉ
    const addressData = {
        lat,
        long,
        streetLine1,
        streetLine2,
        ward,
        district,
        city,
        country,
    };
    // console.log('addressData', addressData);
    const address = await addressHandler.create(addressData);
    // // Tạo địa điểm
    if (!address)
        return res.status(400).json(RESPONSE.FAILURE(400, 'bad address data'));

    const newAdsLocation = await handler.create({
        address: address._id,
        locationType: data.locationType,
        adsCategory: data.adsCategory,
    });
    res.status(200).json(RESPONSE.SUCCESS(newAdsLocation, 'created'));
};

controller.patchAdsLocation = async (req, res) => {
    // Todo: validate
    const { id } = req.params;
    const adsLocation = await handler.getById(id);
    if (!adsLocation) return res.status(204).end();
    // Cập nhật địa chỉ của location
    const data = req.body;
    const {
        lat,
        long,
        streetLine1,
        streetLine2,
        ward,
        district,
        city,
        country,
    } = data;
    // Tạo thông tin địa chỉ
    const addressData = {
        lat,
        long,
        streetLine1,
        streetLine2,
        ward,
        district,
        city,
        country,
    };

    const populate = [
        { path: 'address' },
        { path: 'adsCategory', select: '-_id' },
        { path: 'locationType', select: '-_id' },
    ];
    const [updateAddressResp, updateResp] = await Promise.all([
        addressHandler.updateById(adsLocation.address, addressData),
        handler.updateAndReturn({ _id: id }, data, {}, populate),
    ]);
    res.status(200).json(RESPONSE.SUCCESS(updateResp, 'updated'));
};

controller.deleteAdsLocation = async (req, res) => {
    // Xoá địa điểm thì xoá luôn address (set trong middleware)
    const { id } = req.params;
    const result = await handler.deleteAndReturn({ _id: id });
    res.status(200).json(RESPONSE.SUCCESS(result, 'deleted'));
};

export default controller;
