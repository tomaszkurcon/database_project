const express = require("express");

const rentalController = require("../../controllers/userControllers/rentals");
const router = express.Router();

router.post("/add", rentalController.postAddRental);
router.put("/pay", rentalController.putUpdateRentalPaidStatus);
router.put("/update", rentalController.putUpdateRentalDates);
router.delete("/delete/:id", rentalController.deleteRemoveRental);

module.exports = router;