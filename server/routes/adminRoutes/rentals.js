const express = require("express");

const rentalController = require("../../controllers/adminControllers/rentals");
const router = express.Router();

router.patch("/update", rentalController.patchUpdateRental);
router.get("/current", rentalController.getCurrentRentals);
router.get("/period", rentalController.getRentalsByPeriod);
router.get("/income", rentalController.getPeriodIncome);
router.get("/yearly-income", rentalController.getYearlyIncomeReport);
router.get("/car-income", rentalController.getYearlyIncomePerCarReport);

module.exports = router;