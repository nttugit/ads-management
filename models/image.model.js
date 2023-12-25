import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ImageSchema = new Schema(
    {
        fileName: String,
        path: String,
        extension: String,
        originalName: String,
        originalSize: String,
        originalMimeType: String,

        // Để biết thuộc biển quảng cáo nào đó
        ads: { type: Schema.Types.ObjectId, ref: 'ads' },
        // Để biết thuộc report nào đó
        report: { type: Schema.Types.ObjectId, ref: 'report' },
    },
    { versionKey: false },
);

const Model = mongoose.model('image', ImageSchema);

export default Model;
