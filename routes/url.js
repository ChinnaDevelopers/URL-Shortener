const express = require("express");
const router = express.Router();

const { GenerateNewShortURL, getAnalytics } = require("../controllers/url");

router.post("/", GenerateNewShortURL);
router.get("/analytics/:shortID", getAnalytics);

module.exports = router;
