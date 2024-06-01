const express = require("express");

const rentalController = require("../../controllers/adminControllers/rentals");
const router = express.Router();

router.patch("/update", rentalController.patchUpdateRental);
router.delete("/delete/:id", rentalController.deleteRemoveRental);
router.get("/current", rentalController.getCurrentRentals);
router.get("/period", rentalController.getRentalsByPeriod);
router.get("/income", rentalController.getPeriodIncome);

module.exports = router;