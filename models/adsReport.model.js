import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AdsReportSchema = new Schema(
    {
        ads: { type: Schema.Types.ObjectId, ref: 'ads', required: true },
        report: { type: Schema.Types.ObjectId, ref: 'report', required: true },

        ward: { type: Schema.Types.ObjectId, ref: 'ward', required: true }, // Thiết kế không tốt, làm cho vui
        district: {
            type: Schema.Types.ObjectId,
            ref: 'district',
            required: true,
        }, // Thiết kế không tốt, làm cho vui
        // Thiết kế không tốt, làm cho vui
        guestId: { type: String, required: true },
    },
    { versionKey: false },
);

AdsReportSchema.index({ guestId: 'text' });

const Model = mongoose.model('ads_report', AdsReportSchema);

export default Model;
