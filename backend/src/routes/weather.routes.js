const express = require("express");
const router = express.Router();

const { getWeather } = require("../controllers/weather.controller");

// Public route — guests can search weather too, no auth required
router.get("/", getWeather);

module.exports = router;