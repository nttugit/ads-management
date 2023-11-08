import mongoose from 'mongoose';
const dbURI = 'mongodb://localhost:27017/ads-management';

const connectDB = () => {
    mongoose
        .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log('Connected to MongoDB: ', dbURI);
        })
        .catch((err) => {
            console.error('Error connecting to MongoDB: ', err);
        });
};

export default connectDB;
