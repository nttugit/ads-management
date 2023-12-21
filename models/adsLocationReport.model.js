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
    },
    { versionKey: false },
);

const Model = mongoose.model('ads_location_report', AdsLocationReportSchema);

export default Model;
