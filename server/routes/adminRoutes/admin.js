const express = require("express");

const rentalsRoutes = require("./rentals"); 

const router = express.Router();

router.use("/car-rental", rentalsRoutes);

module.exports = router;