const axios = require("axios");
require("dotenv").config();

// Open-Meteo weather codes -> human readable descriptions
// (Open-Meteo returns a numeric code, not text, so we map it ourselves)
const WEATHER_CODES = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow fall",
  73: "Moderate snow fall",
  75: "Heavy snow fall",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

function describeWeatherCode(code) {
  return WEATHER_CODES[code] || "Unknown";
}

// Step 1: turn a city name into latitude/longitude + country
// (Open-Meteo's forecast API needs coordinates, not a city name)
async function getCoordinates(city) {
  const response = await axios.get(process.env.GEOCODING_API_BASE_URL, {
    params: { name: city, count: 1 },
  });

  const results = response.data.results;

  if (!results || results.length === 0) {
    const error = new Error(`City "${city}" not found`);
    error.statusCode = 404;
    throw error;
  }

  const { latitude, longitude, name, country, timezone } = results[0];
  return { latitude, longitude, name, country, timezone };
}

// Step 2: fetch live weather data using coordinates
async function getWeatherByCoordinates(latitude, longitude, timezone) {
  const response = await axios.get(process.env.WEATHER_API_BASE_URL, {
    params: {
      latitude,
      longitude,
      current: "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,pressure_msl",
      timezone: timezone || "auto",
    },
  });

  return response.data.current;
}

// Combines both steps into one clean function the controller can call
async function fetchWeatherForCity(city) {
  const location = await getCoordinates(city);
  const current = await getWeatherByCoordinates(
    location.latitude,
    location.longitude,
    location.timezone
  );

  return {
    city: location.name,
    country: location.country,
    temperature: current.temperature_2m,
    feelsLike: current.apparent_temperature,
    description: describeWeatherCode(current.weather_code),
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    pressure: current.pressure_msl,
    localTime: current.time,
  };
}

module.exports = { fetchWeatherForCity };