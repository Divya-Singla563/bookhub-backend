import redisClient from "../config/redis-config.js";

const redisCache = async (req, res, next) => {
  try {
    if (!redisClient.isOpen) return next();

    const hashKey = `cache:books:${req.user._id}`;
    const fieldKey = req.originalUrl;
    
    const data = await redisClient.hGet(hashKey, fieldKey);

    if (data) {
      return res.json(JSON.parse(data));
    } else {
      next();
    }
  } catch (error) {
    console.error("Redis Cache Error:", error);
    next();
  }
};

export default redisCache;
