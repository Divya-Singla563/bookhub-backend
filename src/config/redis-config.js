import { createClient } from "redis";

const redisClient = createClient({
  url: "redis://127.0.0.1:6379",
});

redisClient.on("error", (err) => {
  console.log("Redis error:", err);
});

try {
  await redisClient.connect();
  console.log("Redis connected");
} catch (error) {
  console.log("Could not connect to Redis", error);
}

export default redisClient;
