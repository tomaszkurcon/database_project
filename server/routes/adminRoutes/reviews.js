const express = require("express");

const reviewController = require("../../controllers/adminControllers/reviews");
const router = express.Router();

router.delete("/delete/:id", reviewController.deleteRemoveReview);

module.exports = router;