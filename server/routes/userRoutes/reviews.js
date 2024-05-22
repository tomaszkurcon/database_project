const express = require("express");

const reviewsController = require("../../controllers/userControllers/reviews");
const router = express.Router();

router.post("/add", reviewsController.postAddReview);

module.exports = router;