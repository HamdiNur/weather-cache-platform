const express = require("express");
const router = express.Router();
const { getPopular } = require("../controllers/popular.controller");

router.get("/", getPopular);

module.exports = router;