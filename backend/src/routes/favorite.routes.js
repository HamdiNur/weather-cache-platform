const express = require("express");
const router = express.Router();

const { getFavorites, addFavorite, removeFavorite } = require("../controllers/favorite.controller");
const authMiddleware = require("../middleware/auth.middleware");

// All favorites routes require a logged-in user
router.get("/", authMiddleware, getFavorites);
router.post("/", authMiddleware, addFavorite);
router.delete("/:id", authMiddleware, removeFavorite);

module.exports = router;