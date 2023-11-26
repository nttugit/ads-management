import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AuthSchema = new Schema({
    email: String, // username
    password: String,
});

const Auth = mongoose.model('Auth', AuthSchema);

export default Auth;
