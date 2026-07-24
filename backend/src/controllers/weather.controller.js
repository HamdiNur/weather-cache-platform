const { fetchWeatherForCity } = require("../services/weather.service");
const { getCachedWeather, setCachedWeather } = require("../services/redis.service");
const { successResponse, errorResponse } = require("../utils/response");

async function getWeather(req, res) {
  try {
    const { city } = req.query;

    if (!city) {
      return errorResponse(res, 400, "City query parameter is required");
    }

    const startTime = Date.now();

    // ---------- Cache-aside pattern ----------
    // 1. Check Redis first
    const cached = await getCachedWeather(city);

    if (cached) {
      const responseTime = Date.now() - startTime;
      return successResponse(res, 200, "Weather data fetched successfully", {
        ...cached,
        cache: "HIT",
        responseTimeMs: responseTime,
      });
    }

    // 2. Not cached -> fetch fresh from the real API
    const weatherData = await fetchWeatherForCity(city);

    // 3. Store it in Redis for next time (fire and forget is fine here,
    //    but we await it to guarantee it's saved before responding)
    await setCachedWeather(city, weatherData);

    const responseTime = Date.now() - startTime;
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