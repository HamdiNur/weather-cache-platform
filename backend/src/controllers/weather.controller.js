const { fetchWeatherForCity } = require("../services/weather.service");
const { getCachedWeather, setCachedWeather } = require("../services/redis.service");
const { successResponse, errorResponse } = require("../utils/response");
const { verifyToken } = require("../utils/jwt");
const pool = require("../config/db");

// Logs a search into Postgres, but only if we can identify a logged-in user.
// This never throws — a logging failure should never break the weather response.
async function logSearchIfAuthenticated(req, city) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) return;

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    await pool.query(
      "INSERT INTO search_history (user_id, city) VALUES ($1, $2)",
      [decoded.id, city]
    );
  } catch (err) {
    // Invalid/expired token, or DB hiccup — silently skip logging.
    // A guest or a logging failure should never break the weather search itself.
  }
}

async function getWeather(req, res) {
  try {
    const { city } = req.query;

    if (!city) {
      return errorResponse(res, 400, "City query parameter is required");
    }

    const startTime = Date.now();

    // ---------- Cache-aside pattern ----------
    const cached = await getCachedWeather(city);

    if (cached) {
      const responseTime = Date.now() - startTime;

      // Log history in the background — don't make the user wait for it
      logSearchIfAuthenticated(req, city);

      return successResponse(res, 200, "Weather data fetched successfully", {
        ...cached,
        cache: "HIT",
        responseTimeMs: responseTime,
      });
    }

    const weatherData = await fetchWeatherForCity(city);
    await setCachedWeather(city, weatherData);

    const responseTime = Date.now() - startTime;

    logSearchIfAuthenticated(req, city);

    return successResponse(res, 200, "Weather data fetched successfully", {
      ...weatherData,
      cache: "MISS",
      responseTimeMs: responseTime,
    });
  } catch (err) {
    console.error("Weather fetch error:", err.message);
    const statusCode = err.statusCode || 500;
    return errorResponse(res, statusCode, err.message || "Failed to fetch weather data");
  }
}

module.exports = { getWeather };