const { fetchWeatherForCity } = require("../services/weather.service");
const { successResponse, errorResponse } = require("../utils/response");

// NOTE: No Redis caching yet — this hits the real Open-Meteo API every time.
// Step 4 will wrap this with cache-aside logic (check Redis first, etc.)
async function getWeather(req, res) {
  try {
    const { city } = req.query;

    if (!city) {
      return errorResponse(res, 400, "City query parameter is required");
    }

    const startTime = Date.now();
    const weatherData = await fetchWeatherForCity(city);
    const responseTime = Date.now() - startTime;

    return successResponse(res, 200, "Weather data fetched successfully", {
      ...weatherData,
      cache: "MISS", // hardcoded for now — becomes real in Step 4
      responseTimeMs: responseTime,
    });
  } catch (err) {
    console.error("Weather fetch error:", err.message);
    const statusCode = err.statusCode || 500;
    return errorResponse(res, statusCode, err.message || "Failed to fetch weather data");
  }
}

module.exports = { getWeather };