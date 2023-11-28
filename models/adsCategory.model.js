import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AdsCategorySchema = new Schema(
    {
        name: String,
    },
    { versionKey: false },
);

const Model = mongoose.model('ads_category', AdsCategorySchema);

export default Model;
