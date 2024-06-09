const express = require("express");

const reviewsRoutes = require("./reviews");
const rentalsRoutes = require("./rentals");

const router = express.Router();

router.use("/review", reviewsRoutes);
router.use("/rental", rentalsRoutes);


module.exports = router;