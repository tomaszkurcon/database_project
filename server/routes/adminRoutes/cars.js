const express = require("express");

const carController = require("../../controllers/adminControllers/cars");
const router = express.Router();

router.post("/add", carController.postAddCar);

module.exports = router;