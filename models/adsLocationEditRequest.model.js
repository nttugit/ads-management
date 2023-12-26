import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AdsLocationEditRequestSchema = new Schema(
    {
        adsLocation: {
            type: Schema.Types.ObjectId,
            ref: 'ads_location',
            required: true,
        },
        // content: { type: String, required: true },
        requestTime: { type: Date, default: Date.now() },
        reason: { type: String, required: true },
        sender: { type: Schema.Types.ObjectId, ref: 'staff', required: true },
        /**
         * 0: Đang chờ xử lý,
         * 1: Đã xử lý,
         * -1: Đã xoá (Nếu soft delete)
         */
        status: { type: Number, enum: [-1, 0, 1], default: 0 },
    },
    { versionKey: false },
);

const Model = mongoose.model(
    'ads_location_edit_request',
    AdsLocationEditRequestSchema,
);

export default Model;
