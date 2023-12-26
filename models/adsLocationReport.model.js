import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AdsLocationReportSchema = new Schema(
    {
        adsLocation: {
            type: Schema.Types.ObjectId,
            ref: 'ads_location',
            required: true,
        },
        report: { type: Schema.Types.ObjectId, ref: 'report', required: true },

        ward: { type: Schema.Types.ObjectId, ref: 'ward', required: true }, // Thiết kế không tốt, làm cho vui
        district: {
            type: Schema.Types.ObjectId,
            ref: 'district',
            required: true,
        }, // Thiết kế không tốt, làm cho vui
    },
    { versionKey: false },
);

const Model = mongoose.model('ads_location_report', AdsLocationReportSchema);

export default Model;
