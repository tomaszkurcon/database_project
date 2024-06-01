const express = require("express");

const rentalController = require("../../controllers/adminControllers/rentals");
const router = express.Router();

router.patch("/update", rentalController.patchUpdateRental);
router.delete("/delete/:id", rentalController.deleteRemoveRental);

module.exports = router;