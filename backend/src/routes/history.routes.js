const express = require("express");
const router = express.Router();

const { getHistory } = require("../controllers/history.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/", authMiddleware, getHistory);

module.exports = router;