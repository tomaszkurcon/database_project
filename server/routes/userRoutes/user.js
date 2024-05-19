const express = require("express");

const reviewsRoutes = require("./reviews");

const router = express.Router();

router.use("/review", reviewsRoutes);

module.exports = router;