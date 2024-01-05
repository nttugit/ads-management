import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const LocationReportSchema = new Schema(
    {
        // adsLocation: {
        //     type: Schema.Types.ObjectId,
        //     ref: 'ads_location',
        //     required: true,
        // },
        fullAddress: { type: String, required: true },
        lat: Number, // 10.7628318017954,
        long: Number, // 106.68235654416593,
        report: { type: Schema.Types.ObjectId, ref: 'report', required: true },

        // Thiết kế dưới đây không tốt, làm cho tiện thôi
        ward: { type: Schema.Types.ObjectId, ref: 'ward', default: null },
        district: {
            type: Schema.Types.ObjectId,
            ref: 'district',
            default: null,
        },

        guestId: { type: String, required: true },
        /**
         * Mặc định người dân gửi báo cáo lên là Đang chờ
         * -1: Đã xoá
         * 0: Đang chờ (chưa xử lý)
         * 1: Đang xử lý
         * 2 : Đã xử lý xong
         */
        status: { type: Number, enum: [-1, 0, 1, 2], default: 0 },
    },
    { versionKey: false },
);

const Model = mongoose.model('location_report', LocationReportSchema);

export default Model;
