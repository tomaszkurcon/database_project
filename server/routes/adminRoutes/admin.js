const express = require("express");

const storageRoutes = require("./storage");
const rentalsRoutes = require("./rentals"); 
const requireAuth = require("../../middlewares/requireAuth");

const router = express.Router();

router.use(requireAuth);
router.use("/storage", storageRoutes)
router.use("/car-rental", rentalsRoutes);

module.exports = router;