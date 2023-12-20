import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const StaffSchema = new Schema(
    {
        username: { type: String, required: true },
        password: { type: String, required: true },
        // Đã xác thực hay chưa?
        // isVerified: { type: Boolean, default: false },

        fullName: { type: String, required: true },
        dob: { type: Date },
        email: { type: String },
        phone: { type: String },
        role: {
            type: String,
            enum: ['canbo_so', 'canbo_quan', 'canbo_phuong'],
            required: true,
        },
        /**
         * -1: Đã xoá,
         * 0: Tạm ngưng hoạt động (hoặc chưa xác thực),
         * 1: Đang hoạt động
         */
        status: { type: Number, enum: [-1, 0, 1], default: 1 },
        refreshToken: { type: String, default: null },
    },
    { versionKey: false, timestamps: true },
);
StaffSchema.index({ username: 'text' });

const Model = mongoose.model('staff', StaffSchema);

export default Model;
