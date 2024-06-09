const express = require("express");

const carController = require("../../controllers/userControllers/cars");
const router = express.Router();

router.get("/", carController.getAllCars);
router.get("/top-rated", carController.getTopRatedCars);
router.get("/most-rented", carController.getMostRentedCars);
router.get("/price", carController.getSortedCarsByPrice);
router.get("/filter", carController.getFilteredCars);

module.exports = router;