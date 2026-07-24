const { Pool } = require("pg");
require("dotenv").config();

// A connection "pool" reuses a set of open connections instead of
// opening/closing a new one for every query — much faster under load.
const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

pool.on("connect", () => {
  console.log("✅ PostgreSQL pool connected");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected PostgreSQL error:", err.message);
  process.exit(1);
});

module.exports = pool;