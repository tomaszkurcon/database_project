const express = require("express");

const rentalsController = require("../../controllers/adminControllers/rentals");
const router = express.Router();

router.post("/add", rentalsController.postAddCarRental);

module.exports = router;