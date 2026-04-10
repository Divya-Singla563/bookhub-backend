import jwt from "jsonwebtoken";
import crypto from "crypto";

const generateToken = (payload, secretKey, expiresIn) => {
  return jwt.sign(payload, secretKey, { expiresIn });
};


const verifyToken = (token, secretKey) => {
  return jwt.verify(token, secretKey);
};

const hashOTP = (otp) => {
  return crypto.createHash("sha256").update(String(otp)).digest("hex");
};

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};




export { generateToken, verifyToken, hashOTP, hashToken };
