import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AdsLocationSchema = new Schema(
    {
        address: {
            type: Schema.Types.ObjectId,
            ref: 'address',
            required: true,
        },
        locationType: {
            type: Schema.Types.ObjectId,
            ref: 'location_type',
            required: true,
        },
        adsCategory: {
            type: Schema.Types.ObjectId,
            ref: 'ads_category',
            required: true,
        },
        isPlanned: { type: Boolean, default: false }, // Quy hoạch
        editVersion: { type: Number, default: 1 },
        /**
         * 0: Còn trống,
         * 1: Đang hoạt động,
         * 2: Chờ cấp phép,
         * 3: Ẩn,
         * -1: Đã xoá (không còn sài chỗ này nữa)}
         */
        status: { type: Number, enum: [0, 1, 2, 3, -1], default: 0 },
    },
    { versionKey: false },
);

const Model = mongoose.model('ads_location', AdsLocationSchema);

export default Model;
