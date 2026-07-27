const { redisClient } = require("../config/redis");
require("dotenv").config();

const WEATHER_TTL = parseInt(process.env.WEATHER_CACHE_TTL_SECONDS) || 600;
const RECENT_SEARCHES_KEY = "recent-searches";
const POPULAR_CITIES_KEY = "popular-cities";
const RECENT_SEARCHES_LIMIT = 10;

function buildWeatherKey(city) {
  return `weather:${city.trim().toLowerCase()}`;
}

// ---------- Weather cache-aside (unchanged) ----------
async function getCachedWeather(city) {
  const key = buildWeatherKey(city);
  const cached = await redisClient.get(key);
  return cached ? JSON.parse(cached) : null;
}

async function setCachedWeather(city, weatherData) {
  const key = buildWeatherKey(city);
  await redisClient.set(key, JSON.stringify(weatherData), {
    EX: WEATHER_TTL,
  });
}

// ---------- Popular Cities (Redis Sorted Set) ----------
// A sorted set stores members ranked by a numeric "score" — perfect for
// leaderboards. Every search increments that city's score by 1.
async function trackPopularCity(city) {
  const normalized = city.trim();
  await redisClient.zIncrBy(POPULAR_CITIES_KEY, 1, normalized);
}

// Returns the top N cities ranked by search count, highest first.
async function getPopularCities(limit = 10) {
  // withScores gives us [{ value: "London", score: 125 }, ...]
  const results = await redisClient.zRangeWithScores(POPULAR_CITIES_KEY, 0, limit - 1, {
    REV: true, // highest score first
  });

  return results.map((entry) => ({
    city: entry.value,
    count: entry.score,
  }));
}

// ---------- Recent Searches (Redis List) ----------
// A list keeps insertion order — we push new searches to the front (LPUSH)
// and trim the list so it never grows past our limit.
async function trackRecentSearch(city) {
  const normalized = city.trim();

  // Remove any existing occurrence first, so re-searching a city moves it
  // to the front instead of creating a duplicate entry in the list.
  await redisClient.lRem(RECENT_SEARCHES_KEY, 0, normalized);
  await redisClient.lPush(RECENT_SEARCHES_KEY, normalized);
  await redisClient.lTrim(RECENT_SEARCHES_KEY, 0, RECENT_SEARCHES_LIMIT - 1);
}

async function getRecentSearches() {
  return redisClient.lRange(RECENT_SEARCHES_KEY, 0, RECENT_SEARCHES_LIMIT - 1);
}

module.exports = {
  getCachedWeather,
  setCachedWeather,
  trackPopularCity,
  getPopularCities,
  trackRecentSearch,
  getRecentSearches,
};