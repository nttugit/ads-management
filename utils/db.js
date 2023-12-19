import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Connection URL
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/ads-management';
// Connect to MongoDB
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;

// Event listener for successful connection
db.on('connected', () => {
    console.log(`Connected to MongoDB at ${dbUrl}`);
});

// Event listener for connection errors
db.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
});

// Event listener for disconnection
db.on('disconnected', () => {
    console.log('Disconnected from MongoDB');
});

// Close the Mongoose connection when the Node process is terminated
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
    });
});

export default db;
