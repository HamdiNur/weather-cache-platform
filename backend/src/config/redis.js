const { createClient } = require("redis");
require("dotenv").config();

// Create a single Redis client instance to be reused across the whole app.
const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("connect", () => {
  console.log("✅ Redis client connected");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis connection error:", err.message);
});

// The redis v4 client requires an explicit connect() call —
// unlike pg's Pool, it doesn't connect automatically on first use.
async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

module.exports = { redisClient, connectRedis };