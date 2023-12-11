import mongoose from 'mongoose';
import AddressModel from './address.model.js';

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
         * 0: Ngưng hoạt động,
         * 1: Đang hoạt động,
         * -1: Đã xoá (Nếu soft delete)
         */
        status: { type: Number, enum: [0, 1, -1], default: 1 },
    },
    { versionKey: false, timestamps: true },
);

// Middleware để xoá những thứ liên quan đến ads location
AdsLocationSchema.post('findOneAndDelete', async function (doc, next) {
    await AddressModel.deleteOne({ _id: doc.address });
    next();
});

const Model = mongoose.model('ads_location', AdsLocationSchema);

export default Model;
