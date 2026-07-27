const express = require("express");
const router = express.Router();
const { getRecent } = require("../controllers/recent.controller");

router.get("/", getRecent);

module.exports = router;