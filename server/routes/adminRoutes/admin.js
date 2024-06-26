const express = require("express");

const storageRoutes = require("./storage");
const carsRoutes = require("./cars"); 
const rentalRoutes = require("./rentals");
const reviewsRoutes = require("./reviews");

const router = express.Router();

router.use("/storage", storageRoutes)
router.use("/car", carsRoutes);
router.use("/rental", rentalRoutes);
router.use("/review", reviewsRoutes);

module.exports = router;