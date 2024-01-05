import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AdsReportSchema = new Schema(
    {
        ads: { type: Schema.Types.ObjectId, ref: 'ads', required: true },
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

AdsReportSchema.index({ guestId: 'text' });

const Model = mongoose.model('ads_report', AdsReportSchema);

export default Model;
