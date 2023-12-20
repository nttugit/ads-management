import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || 'secret';
const ACCESS_TOKEN_LIFE = process.env.ACCESS_TOKEN_LIFE || '10d';
const REFRESH_TOKEN_SECRET =
    process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh_secret';
const REFRESH_TOKEN_LIFE = process.env.JWT_REFRESH_TOKEN_LIFE || '10d';

const SALT_ROUNDS = process.env.SALT_ROUNDS || 10;

function generateToken(payload) {
    try {
        return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
            algorithm: 'HS256',
            expiresIn: ACCESS_TOKEN_LIFE,
        });
    } catch (error) {
        console.log(`Error in generate access token:  + ${error}`);
        return null;
    }
}

function generateRefreshToken(payload) {
    try {
        return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
            algorithm: 'HS256',
            expiresIn: REFRESH_TOKEN_LIFE,
        });
    } catch (error) {
        console.log(`Error in generate access token:  + ${error}`);
        return null;
    }
}

function verifyToken(token) {
    try {
        return jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (error) {
        console.log(`Error in verify access token:  + ${error}`);
        return null;
    }
}

function verifyRefreshToken(token) {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET);
    } catch (error) {
        console.log(`Error in verify access token:  + ${error}`);
        return null;
    }
}

function hashPassword(password) {
    return bcrypt.hashSync(password, SALT_ROUNDS);
}

function comparePassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
}

export {
    generateToken,
    verifyToken,
    generateRefreshToken,
    verifyRefreshToken,
    hashPassword,
    comparePassword,
};
