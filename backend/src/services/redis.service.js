const { redisClient } = require("../config/redis");
require("dotenv").config();

const WEATHER_TTL = parseInt(process.env.WEATHER_CACHE_TTL_SECONDS) || 600;

// Normalizes city names into a consistent Redis key,
// e.g. "New York" and "new york" both become "weather:new york"
function buildWeatherKey(city) {
  return `weather:${city.trim().toLowerCase()}`;
}

// ---------- Cache-aside: GET ----------
// Checks Redis for existing weather data for this city.
// Returns the parsed object if found, or null if not cached.
async function getCachedWeather(city) {
  const key = buildWeatherKey(city);
  const cached = await redisClient.get(key);
  return cached ? JSON.parse(cached) : null;
}

// ---------- Cache-aside: SET ----------
// Stores fresh weather data in Redis with a TTL (expires automatically).
async function setCachedWeather(city, weatherData) {
  const key = buildWeatherKey(city);
  await redisClient.set(key, JSON.stringify(weatherData), {
    EX: WEATHER_TTL,
  });
}

module.exports = {
  getCachedWeather,
  setCachedWeather,
};