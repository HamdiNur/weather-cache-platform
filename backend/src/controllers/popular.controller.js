const { getPopularCities } = require("../services/redis.service");
const { successResponse, errorResponse } = require("../utils/response");

async function getPopular(req, res) {
  try {
    const popular = await getPopularCities(10);
    return successResponse(res, 200, "Popular cities fetched successfully", popular);
  } catch (err) {
    console.error("Get popular cities error:", err.message);
    return errorResponse(res, 500, "Failed to fetch popular cities");
  }
}

module.exports = { getPopular };