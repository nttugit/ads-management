import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AddressSchema = new Schema(
    {
        lat: Number, // 10.7628318017954,
        long: Number, // 106.68235654416593,
        streetLine1: { type: String, default: '' }, // "Nguyễn Văn Cừ",
        streetLine2: { type: String, default: '' }, // "227",
        // ward: String,
        // district: String,
        ward: { type: Schema.Types.ObjectId, ref: 'ward' },
        district: { type: Schema.Types.ObjectId, ref: 'district' },
        city: String,
        country: { type: String, default: '' },
    },
    { versionKey: false },
);

const Model = mongoose.model('address', AddressSchema);

export default Model;
