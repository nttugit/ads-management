import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AdsEditRequestSchema = new Schema(
    {
        ads: { type: Schema.Types.ObjectId, ref: 'ads', required: true },

        // Thông tin mới (không bắt buộc phải có tất cả)
        title: { type: String },
        content: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        price: { type: Number },
        billboardType: {
            type: Schema.Types.ObjectId,
            ref: 'billboard_type',
        },
        adsLocation: {
            type: Schema.Types.ObjectId,
            ref: 'ads_location',
        },
        images: [{ type: Schema.Types.ObjectId, ref: 'image' }],
        //

        requestTime: { type: Date, default: Date.now() },
        reason: { type: String, required: true },
        sender: { type: Schema.Types.ObjectId, ref: 'staff', required: true },

        // code bậy, để filter
        ward: { type: Schema.Types.ObjectId, ref: 'ward', default: null },
        district: {
            type: Schema.Types.ObjectId,
            ref: 'district',
            default: null,
        },

        /**
         * -1: Đã xoá (Nếu soft delete)
         * 0: Đang chờ,
         * 1: Đang xử lý,
         * 2: Đã xử lý
         */
        status: { type: Number, enum: [-1, 0, 1], default: 0 },
    },
    { versionKey: false },
);

const Model = mongoose.model('ads_edit_request', AdsEditRequestSchema);

export default Model;
