const express = require("express");

const carRoutes = require("./cars");

const router = express.Router();

router.use("/car", carRoutes);

module.exports = router;