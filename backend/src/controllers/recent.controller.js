const { getRecentSearches } = require("../services/redis.service");
const { successResponse, errorResponse } = require("../utils/response");

async function getRecent(req, res) {
  try {
    const recent = await getRecentSearches();
    return successResponse(res, 200, "Recent searches fetched successfully", recent);
  } catch (err) {
    console.error("Get recent searches error:", err.message);
    return errorResponse(res, 500, "Failed to fetch recent searches");
  }
}

module.exports = { getRecent };