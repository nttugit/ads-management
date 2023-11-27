import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const LocationTypeSchema = new Schema({
    name: String,
});

const Model = mongoose.model('LocationType', LocationTypeSchema);

export default Model;
