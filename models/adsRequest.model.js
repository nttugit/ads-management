import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AdsRequestSchema = new Schema(
    {
        ads: { type: Schema.Types.ObjectId, ref: 'ads', required: true },
        adsLocation: {
            type: Schema.Types.ObjectId,
            ref: 'ads_location',
            required: true,
        },
        sender: { type: Schema.Types.ObjectId, ref: 'staff', required: true },

        // Thông tin mới (không bắt buộc phải có tất cả)

        content: { type: String },
        // company: {
        //     type: Schema.Types.ObjectId,
        //     ref: 'company',
        //     required: true,
        // },
        companyName: String,
        companyEmail: String,
        companyPhone: String,
        companyAddress: String,

        startDate: { type: Date },
        endDate: { type: Date },

        images: [{ type: Schema.Types.ObjectId, ref: 'image' }],

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
        status: { type: Number, enum: [-1, 0, 1, 2], default: 0 },
    },
    { versionKey: false },
);

const Model = mongoose.model('ads_request', AdsRequestSchema);

export default Model;
