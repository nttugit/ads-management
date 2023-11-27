import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AdsLocationSchema = new Schema({
    address: { type: Schema.Types.ObjectId, ref: 'Address', requried: true },
    locationType: { type: Schema.Types.ObjectId, ref: 'LocationType' },
    adsCategory: { type: Schema.Types.ObjectId, ref: 'AdsCategory' },
    isPlanned: { type: Boolean, default: false }, // Quy hoạch
    editVersion: { type: Number, default: 1 },
    /**
     * 0: Còn trống,
     * 1: Đang hoạt động,
     * 2: Chờ cấp phép,
     * 3: Ẩn,
     * 4: Đã xoá (không còn sài chỗ này nữa)}
     */
    status: { type: Number, enum: [0, 1, 2, 3, 4] },
});

const Model = mongoose.model('AdsLocation', AdsLocationSchema);

export default Model;
