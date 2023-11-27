import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AdsCategorySchema = new Schema({
    name: String,
});

const Model = mongoose.model('AdsCategory', AdsCategorySchema);

export default Model;
