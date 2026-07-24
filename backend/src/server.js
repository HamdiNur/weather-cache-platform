require("dotenv").config();
const app = require("./app");
const { connectRedis } = require("./config/redis");
const pool = require("./config/db");

const PORT = process.env.PORT || 5000;

// We start the server only AFTER Redis is connected — this way, if Redis
// is down when the app starts, we fail fast with a clear error instead of
// silently accepting requests that will break the moment caching is needed.
async function startServer() {
  try {
    await connectRedis();

    // Quick sanity check that Postgres is reachable too
    await pool.query("SELECT 1");
    console.log("✅ PostgreSQL connection verified");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🔎 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
}

startServer();