const pool = require("../config/db");
const { successResponse, errorResponse } = require("../utils/response");

// GET /api/history — list the logged-in user's search history (most recent first)
async function getHistory(req, res) {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      "SELECT id, city, searched_at FROM search_history WHERE user_id = $1 ORDER BY searched_at DESC LIMIT 50",
      [userId]
    );

    return successResponse(res, 200, "History fetched successfully", result.rows);
  } catch (err) {
    console.error("Get history error:", err.message);
    return errorResponse(res, 500, "Failed to fetch history");
  }
}

module.exports = { getHistory };