import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ReportSchema = new Schema(
    {
        reportType: { type: Schema.Types.ObjectId, ref: 'report_type' },

        fullName: { type: String, required: true },
        email: { type: String },
        phone: { type: String },
        content: { type: String }, // todo: how to deal with ckeditor?
        images: [{ type: Schema.Types.ObjectId, ref: 'image' }],
    },
    { versionKey: false, timestamps: true },
);

// Lọc danh sách status
ReportSchema.index({ status: 1 });

const Model = mongoose.model('report', ReportSchema);

export default Model;
