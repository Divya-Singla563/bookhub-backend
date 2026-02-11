import jwt from "jsonwebtoken";
import crypto from "crypto";

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

const hashOTP = (otp) => {
    return crypto.createHash('sha256').update(String(otp)).digest('hex')
};

export { generateToken, verifyToken, hashOTP };