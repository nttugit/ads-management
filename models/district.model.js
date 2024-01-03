import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const DistrictSchema = new Schema(
    {
        // Tên quận
        name: { type: String, required: true },
        // Cán bộ đảm nhiệm
        // staff: { type: Schema.Types.ObjectId, ref: 'staff', default: null },
        staffs: { type: [Schema.Types.ObjectId], ref: 'staff', default: [] },
        // Ngày bổ nhiệm
        // appointmentDate: { type: Date, default: null },
    },
    { versionKey: false },
);

const Model = mongoose.model('district', DistrictSchema);

export default Model;
