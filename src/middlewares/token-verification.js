import jwt from "jsonwebtoken";

export const authVerify = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authorization.split(" ")[1].trim();

    if (!token) {
      return res.status(401).json({ message: "token not provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("::::::::::::::::::::::::>>>>>>>>>>", decoded);
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

// const jwt = require("jsonwebtoken");
// const { sessions } = require("../models/session");

// module.exports.authVerify = async (req, res, next) => {
//   try {
//     const authorization = req.headers.authorization;
//     if (!authorization) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }
//     const token = authorization.split(" ")[1].trim();
//     if (!token) {
//       return res.status(401).json({ message: "Token not provided" });
//     }
//     const decoded = jwt.verify(token, process.env.SECRET_KEY);
//     req.user = decoded;
//     console.log('::::::::::::::::::::::::>>>>>>>>>>',decoded);
//     // const user_active = await sessions.findOne({ user_id: decoded.user_id });
//     next();
//   } catch (error) {
//     console.log(error);

//     return res.status(401).json({ message: "Invalid token" });
//   }
// };
