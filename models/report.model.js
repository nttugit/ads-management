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
        /**
         * -1: Đã xoá (có thể không có status này),
         * 0: Chưa duyệt
         * 1: Đã duyệt
         */
        status: { type: Number, enum: [-1, 0, 1], default: 0 },
    },
    { versionKey: false, timestamps: true },
);

// Lọc danh sách status
ReportSchema.index({ status: 1 });

const Model = mongoose.model('report', ReportSchema);

export default Model;
