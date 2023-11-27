import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AddressSchema = new Schema({
    lat: Number,
    long: Number,
    streetLine1: String,
    streetLine2: String,
    ward: String,
    district: String,
    city: String,
    country: String,
});

const Model = mongoose.model('Address', AddressSchema);

export default Model;
