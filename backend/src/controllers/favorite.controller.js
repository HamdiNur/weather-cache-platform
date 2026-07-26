const pool = require("../config/db");
const { successResponse, errorResponse } = require("../utils/response");

// GET /api/favorites — list the logged-in user's favorite cities
async function getFavorites(req, res) {
  try {
    const userId = req.user.id; // attached by auth.middleware.js

    const result = await pool.query(
      "SELECT id, city, country, created_at FROM favorites WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    return successResponse(res, 200, "Favorites fetched successfully", result.rows);
  } catch (err) {
    console.error("Get favorites error:", err.message);
    return errorResponse(res, 500, "Failed to fetch favorites");
  }
}

// POST /api/favorites — add a city to favorites
async function addFavorite(req, res) {
  try {
    const userId = req.user.id;
    const { city, country } = req.body;

    if (!city) {
      return errorResponse(res, 400, "City is required");
    }

    const result = await pool.query(
      `INSERT INTO favorites (user_id, city, country)
       VALUES ($1, $2, $3)
       RETURNING id, city, country, created_at`,
      [userId, city, country || null]
    );

    return successResponse(res, 201, "City added to favorites", result.rows[0]);
  } catch (err) {
    // Postgres unique constraint violation (user_id, city) already exists
    if (err.code === "23505") {
      return errorResponse(res, 409, "City is already in your favorites");
    }
    console.error("Add favorite error:", err.message);
    return errorResponse(res, 500, "Failed to add favorite");
  }
}

// DELETE /api/favorites/:id — remove a favorite
async function removeFavorite(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM favorites WHERE id = $1 AND user_id = $2 RETURNING id",
      [id, userId]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 404, "Favorite not found");
    }

    return successResponse(res, 200, "Favorite removed successfully");
  } catch (err) {
    console.error("Remove favorite error:", err.message);
    return errorResponse(res, 500, "Failed to remove favorite");
  }
}

module.exports = { getFavorites, addFavorite, removeFavorite };