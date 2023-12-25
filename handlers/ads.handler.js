import BaseHandler from './base.handler.js';
import AdsModel from '../models/ads.model.js';
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;

class Handler extends BaseHandler {
    constructor() {
        super(AdsModel);
    }

    // Dùng mongo aggregate
    async getAdsByAreas(
        conditions = {},
        projection = {},
        pagination = {
            skip: 0,
            limit: 50,
        },
    ) {
        let filter = {};
        const addressFilter = [];
        const skip = pagination.page * pagination.size - pagination.size;
        if (conditions?.wards) {
            addressFilter.push({
                $in: [
                    '$ward',
                    conditions.wards.map((ward) => new ObjectId(ward)),
                ],
            });
        }
        if (conditions?.districts) {
            addressFilter.push({
                $in: [
                    '$district',
                    conditions.districts.map(
                        (district) => new ObjectId(district),
                    ),
                ],
            });
        }
        if (conditions?.status) filter['status'] = parseInt(conditions.status);
        return this.Model.aggregate([
            {
                $match: {
                    ...filter,
                },
            },
            {
                $lookup: {
                    from: 'ads_locations',
                    let: { adsLocation: '$adsLocation' },
                    pipeline: [
                        {
                            $match: {
                                // $expr: {
                                //     $and: [{ $eq: ['$_id', '$$adsLocation'] }],
                                // },
                                $expr: {
                                    $eq: ['$_id', '$$adsLocation'],
                                },
                            },
                        },
                        // address
                        {
                            $lookup: {
                                from: 'addresses',
                                let: { address: '$address' },
                                pipeline: [
                                    {
                                        $match: {
                                            // $expr: {
                                            //     $and: [{ $eq: ['$_id', '$$adsLocation'] }],
                                            // },
                                            $expr: {
                                                $and: [
                                                    {
                                                        $eq: [
                                                            '$_id',
                                                            '$$address',
                                                        ],
                                                    },
                                                    ...addressFilter,
                                                    // {
                                                    //     // ...addressFilter,
                                                    //     $in: [
                                                    //         '$district',
                                                    //         ['8'],
                                                    //     ],
                                                    // },
                                                ],
                                            },
                                        },
                                    },
                                    // ward
                                    {
                                        $lookup: {
                                            from: 'wards',
                                            let: { ward: '$ward' },
                                            pipeline: [
                                                {
                                                    $match: {
                                                        $expr: {
                                                            $eq: [
                                                                '$_id',
                                                                '$$ward',
                                                            ],
                                                        },
                                                    },
                                                },
                                                {
                                                    $project: {
                                                        name: 1,
                                                        _id: 0,
                                                    },
                                                },
                                            ],
                                            as: 'ward',
                                        },
                                    },
                                    {
                                        $unwind: '$ward',
                                    },
                                    // district
                                    {
                                        $lookup: {
                                            from: 'districts',
                                            let: { district: '$district' },
                                            pipeline: [
                                                {
                                                    $match: {
                                                        $expr: {
                                                            $eq: [
                                                                '$_id',
                                                                '$$district',
                                                            ],
                                                        },
                                                    },
                                                },
                                                {
                                                    $project: {
                                                        name: 1,
                                                        _id: 0,
                                                    },
                                                },
                                            ],
                                            as: 'district',
                                        },
                                    },
                                    {
                                        $unwind: '$district',
                                    },
                                ],
                                as: 'address',
                            },
                        },
                        {
                            $unwind: '$address',
                        },
                        // adsCategory
                        {
                            $lookup: {
                                from: 'ads_categories',
                                let: { adsCategory: '$adsCategory' },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: ['$_id', '$$adsCategory'],
                                            },
                                        },
                                    },
                                    { $project: { _id: 0 } },
                                ],
                                as: 'adsCategory',
                            },
                        },
                        {
                            $unwind: '$adsCategory',
                        },
                        // locationType
                        {
                            $lookup: {
                                from: 'location_types',
                                let: { locationType: '$locationType' },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: ['$_id', '$$locationType'],
                                            },
                                        },
                                    },
                                    { $project: { _id: 0 } },
                                ],
                                as: 'locationType',
                            },
                        },
                        {
                            $unwind: '$locationType',
                        },
                    ],

                    as: 'adsLocation',
                },
            },
            {
                $unwind: '$adsLocation',
            },
            {
                $lookup: {
                    from: 'billboard_types',
                    let: { billboardType: '$billboardType' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$_id', '$$billboardType'],
                                },
                            },
                        },
                        {
                            $project: { _id: 0 },
                        },
                    ],

                    as: 'billboardType',
                },
            },
            {
                $unwind: '$billboardType',
            },
            {
                $lookup: {
                    from: 'images',
                    let: { images: '$images' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ['$_id', '$$images'],
                                },
                            },
                        },
                        {
                            $project: { _id: 0, ads: 0 },
                        },
                    ],

                    as: 'images',
                },
            },
            {
                $project: projection,
            },
            {
                $limit: parseInt(pagination.size),
            },
            {
                $skip: skip,
            },
        ]);
    }

    async countAdsByAreas(conditions = {}) {
        const addressFilter = [];
        if (conditions?.wards) {
            addressFilter.push({
                $in: ['$ward', conditions.wards],
            });
        }
        if (conditions?.districts) {
            addressFilter.push({
                $in: ['$district', conditions.districts],
            });
        }

        const data = await this.Model.aggregate([
            {
                $match: {
                    // ...filter,
                },
            },
            {
                $lookup: {
                    from: 'ads_locations',
                    let: { adsLocation: '$adsLocation' },
                    pipeline: [
                        {
                            $match: {
                                // $expr: {
                                //     $and: [{ $eq: ['$_id', '$$adsLocation'] }],
                                // },
                                $expr: {
                                    $eq: ['$_id', '$$adsLocation'],
                                },
                            },
                        },
                        {
                            $lookup: {
                                from: 'addresses',
                                let: { address: '$address' },
                                pipeline: [
                                    {
                                        $match: {
                                            // $expr: {
                                            //     $and: [{ $eq: ['$_id', '$$adsLocation'] }],
                                            // },
                                            $expr: {
                                                $and: [
                                                    {
                                                        $eq: [
                                                            '$_id',
                                                            '$$address',
                                                        ],
                                                    },
                                                    ...addressFilter,
                                                    // {
                                                    //     // ...addressFilter,
                                                    //     $in: [
                                                    //         '$district',
                                                    //         ['8'],
                                                    //     ],
                                                    // },
                                                ],
                                            },
                                        },
                                    },
                                    //   { $project: { rarity: 1 } },
                                    //   { $limit: 1 },
                                ],
                                as: 'address',
                            },
                        },
                        {
                            $unwind: '$address',
                        },
                        //   { $project: { rarity: 1 } },
                        //   { $limit: 1 },
                    ],

                    as: 'adsLocation',
                },
            },
            {
                $unwind: '$adsLocation',
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 },
                },
            },
        ]);
        return data?.[0]?.count;
    }
}

export default Handler;
