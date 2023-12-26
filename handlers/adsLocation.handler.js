import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
import BaseHandler from './base.handler.js';
import AdsLocationModel from '../models/adsLocation.model.js';

class Handler extends BaseHandler {
    constructor() {
        super(AdsLocationModel);
    }

    // Dùng mongo aggregate
    async getAdsLocationsByAreas(
        conditions = {},
        projection = {},
        pagination = {
            skip: 0,
            limit: 50,
        },
    ) {
        console.log('conditions', conditions);
        let filter = {};
        const addressFilter = [];
        const skip = pagination.page * pagination.size - pagination.size;
        // Format filter cho table address
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
        if (typeof conditions?.isPlanned == 'boolean')
            filter['isPlanned'] = conditions?.isPlanned;

        console.log('filter', filter);
        console.log('addressFilter', addressFilter);
        return this.Model.aggregate([
            {
                $match: {
                    ...filter,
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
                                $expr: {
                                    $and: [
                                        {
                                            $eq: ['$_id', '$$address'],
                                        },
                                        ...addressFilter,
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
                                                $eq: ['$_id', '$$ward'],
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
                                                $eq: ['$_id', '$$district'],
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

    async countAdsLocationsByAreas(conditions = {}) {
        let filter = {};
        const addressFilter = [];
        // Format filter cho table address
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
        if (typeof conditions?.isPlanned == 'boolean')
            filter['isPlanned'] = conditions?.isPlanned;

        const data = await this.Model.aggregate([
            {
                $match: {
                    ...filter,
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
                                            $eq: ['$_id', '$$address'],
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
                                                $eq: ['$_id', '$$ward'],
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
                                                $eq: ['$_id', '$$district'],
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
