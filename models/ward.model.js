import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const WardSchema = new Schema(
    {
        // Tên phường
        name: { type: String, required: true },
        // Cán bộ đảm nhiệm
        staff: { type: Schema.Types.ObjectId, ref: 'staff', default: null },
        // Ngày bổ nhiệm
        appointmentDate: { type: Date, default: null },
        district: {
            type: Schema.Types.ObjectId,
            ref: 'district',
            required: true,
        },
    },
    { versionKey: false, timestamps: true },
);

const Model = mongoose.model('ward', WardSchema);

export default Model;
