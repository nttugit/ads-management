import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ReportSolutionSchema = new Schema(
    {
        ward: { type: Schema.Types.ObjectId, ref: 'ward', required: true },
        reportType: {
            type: Schema.Types.ObjectId,
            ref: 'report_type',
            required: true,
        },
        solution: { type: String, default: '' },
    },
    { versionKey: false },
);

const Model = mongoose.model('report_solution', ReportSolutionSchema);

export default Model;
