const express = require("express");

const carController = require("../../controllers/userControllers/cars");
const router = express.Router();

router.get("/top-rated", carController.getTopRatedCars);
router.get("/most-rented", carController.getMostRentedCars);
router.get("/price", carController.getSortedCarsByPrice);

module.exports = router;