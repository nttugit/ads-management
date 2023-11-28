import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const LocationTypeSchema = new Schema(
    {
        name: String,
    },
    { versionKey: false },
);

const Model = mongoose.model('location_type', LocationTypeSchema);

export default Model;
