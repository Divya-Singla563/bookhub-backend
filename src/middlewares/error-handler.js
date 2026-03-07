import logger from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    route: req.originalUrl,
    method: req.method,
    stack: err.stack,
  });

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;
