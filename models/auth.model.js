import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AuthSchema = new Schema(
    {
        email: String, // username
        password: String,
    },
    { versionKey: false },
);

const Auth = mongoose.model('auth', AuthSchema);

export default Auth;
