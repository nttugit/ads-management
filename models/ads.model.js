import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AdsSchema = new Schema(
    {
        title: { type: String, required: true },
        // Có nên đổi thành ckeditor?
        content: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        width: { type: Number, required: true }, // in centimeter
        height: { type: Number, required: true }, // in centimeter
        price: { type: Number, required: true }, // in centimeter

        billboardType: {
            type: Schema.Types.ObjectId,
            ref: 'billboard_type',
            required: true,
        },
        adsLocation: {
            type: Schema.Types.ObjectId,
            ref: 'ads_location',
            required: true,
        },
        images: [{ type: Schema.Types.ObjectId, ref: 'image' }],
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
    { versionKey: false, timestamps: true },
);

const Model = mongoose.model('ads', AdsSchema);

export default Model;
