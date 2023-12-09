import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const BillboardTypeSchema = new Schema(
    {
        name: String,
    },
    { versionKey: false },
);

const Model = mongoose.model('billboard_type', BillboardTypeSchema);

export default Model;
