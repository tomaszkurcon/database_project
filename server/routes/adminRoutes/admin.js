const express = require("express");

const storageRoutes = require("./storage");
const carsRoutes = require("./cars"); 
const requireAuth = require("../../middlewares/requireAuth");

const router = express.Router();

router.use(requireAuth);
router.use("/storage", storageRoutes)

router.use("/car", carsRoutes);

module.exports = router;