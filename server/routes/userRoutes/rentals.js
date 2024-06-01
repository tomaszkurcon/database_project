const express = require("express");

const rentalController = require("../../controllers/userControllers/rentals");
const router = express.Router();

router.post("/add", rentalController.postAddRental);
router.patch("/pay", rentalController.patchUpdateRentalPaidStatus);
router.patch("/update", rentalController.patchUpdateRentalDates);
router.delete("/delete/:id", rentalController.deleteRemoveRental);
router.get("/history/:id", rentalController.getUserRentalHistory);

module.exports = router;