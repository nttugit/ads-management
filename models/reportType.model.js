import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ReportTypeSchema = new Schema(
    {
        name: String,
    },
    { versionKey: false },
);

const Model = mongoose.model('report_type', ReportTypeSchema);

export default Model;
