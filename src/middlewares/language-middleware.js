import { Messages } from "../constants/index.js";

export const languageMiddleware = (req, res, next) => {
  const lang = req.headers["accept-language"] || "en";

  req.lang = Messages[lang] ? lang : "en";
  req.messages = Messages[req.lang];

  next();
};
