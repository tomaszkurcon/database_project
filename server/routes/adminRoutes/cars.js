const express = require("express");

const carController = require("../../controllers/adminControllers/cars");
const router = express.Router();

router.post("/add", carController.postAddCar);
router.patch("/update", carController.patchUpdateCar);
router.delete("/delete/:id", carController.deleteRemoveCar);

module.exports = router;