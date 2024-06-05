const express = require("express");

const reviewsRoutes = require("./reviews");
const rentalsRoutes = require("./rentals");
const carsRoutes = require("./cars");

const router = express.Router();

router.use("/review", reviewsRoutes);
router.use("/rental", rentalsRoutes);
router.use("/car", carsRoutes);

module.exports = router;