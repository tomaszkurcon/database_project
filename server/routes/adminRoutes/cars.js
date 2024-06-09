const express = require("express");
const carController = require("../../controllers/adminControllers/cars");
const imagesUploadMiddleware = require("../../middlewares/imagesUpload");
const router = express.Router();

router.use(imagesUploadMiddleware)
router.post("/add", carController.postAddCar);
router.patch("/update", carController.patchUpdateCar);
router.delete("/delete/:id", carController.deleteRemoveCar);

module.exports = router;