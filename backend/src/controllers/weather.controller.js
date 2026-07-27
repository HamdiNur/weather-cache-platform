const { fetchWeatherForCity } = require("../services/weather.service");
const {
  getCachedWeather,
  setCachedWeather,
  trackPopularCity,
  trackRecentSearch,
} = require("../services/redis.service");
const { successResponse, errorResponse } = require("../utils/response");
const { verifyToken } = require("../utils/jwt");
const pool = require("../config/db");

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
    // Silently skip — invalid token or DB hiccup should never break the search
  }
}

// Tracks the search in Redis for popular cities + recent searches.
// Runs for EVERY search, guest or logged-in — these are global, not per-user.
async function trackSearchGlobally(city) {
  try {
    await trackPopularCity(city);
    await trackRecentSearch(city);
  } catch (err) {
    console.error("Failed to track search:", err.message);
  }
}

async function getWeather(req, res) {
  try {
    const { city } = req.query;

    if (!city) {
      return errorResponse(res, 400, "City query parameter is required");
    }

    const startTime = Date.now();

    const cached = await getCachedWeather(city);

    if (cached) {
      const responseTime = Date.now() - startTime;

      logSearchIfAuthenticated(req, city);
      trackSearchGlobally(city);

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
    trackSearchGlobally(city);

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