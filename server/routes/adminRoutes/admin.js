const express = require("express");

const carsRoutes = require("./cars"); 
const requireAuth = require("../../middlewares/requireAuth");

const router = express.Router();

router.use(requireAuth);
router.use("/car", carsRoutes);

module.exports = router;