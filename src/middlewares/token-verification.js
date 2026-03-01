import jwt from "jsonwebtoken";

export const authVerify = async (req, res, next) => {
  console.log("sdfsd");

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
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Invalid token" });
  }
};
