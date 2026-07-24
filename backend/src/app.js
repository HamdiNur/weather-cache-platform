const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const errorMiddleware = require("./middleware/error.middleware");

const app = express();

// ---------- Global Middleware ----------

// Adds secure HTTP headers (protects against common attacks)
app.use(helmet());

// Allows the React frontend (running on a different port) to call this API
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Logs every incoming request to the console (method, path, status, time)
app.use(morgan("dev"));

// Parses incoming JSON request bodies into req.body
app.use(express.json());

// ---------- Health Check ----------
// Simple route to confirm the server is alive — useful for testing right now,
// and later for deployment platforms that ping this to check uptime.
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Weather Cache Platform API is running" });
});

// ---------- Feature Routes ----------

// We'll uncomment/add these one at a time as we build each feature:
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/weather", require("./routes/weather.routes"));
// app.use("/api/favorites", require("./routes/favorite.routes"));
// app.use("/api/history", require("./routes/history.routes"));

// ---------- 404 Handler ----------
// Catches any request that didn't match a route above
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ---------- Centralized Error Handler ----------
// Must be registered LAST — Express calls this whenever next(err) is used
app.use(errorMiddleware);

module.exports = app;