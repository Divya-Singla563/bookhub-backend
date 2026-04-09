import jwt from "jsonwebtoken";
import crypto from "crypto";

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2d" });
};

const generateAndSaveRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_JWT_SECRET, { expiresIn: "7d" });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const hashOTP = (otp) => {
  return crypto.createHash("sha256").update(String(otp)).digest("hex");
};

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

// export const refreshToken = (req, res) => {
//   const token = req.cookies.refreshToken;

//   if (!token) return res.status(401).send("No refresh token");

//   jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
//     if (err) return res.status(403).send("Invalid token");

//     const newAccessToken = jwt.sign(
//       { id: user.id },
//       process.env.ACCESS_TOKEN_SECRET,
//       { expiresIn: "15m" }
//     );

//     res.json({ accessToken: newAccessToken });
//   });
// };

export { generateToken, verifyToken, hashOTP, generateAndSaveRefreshToken, hashToken };
