const express = require("express");

const rentalController = require("../../controllers/userControllers/rentals");
const router = express.Router();

router.post("/add", rentalController.postAddRental);
router.put("/pay", rentalController.updateRentalPaidStatus);

module.exports = router;