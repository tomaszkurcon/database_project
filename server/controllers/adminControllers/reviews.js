const mongoose = require('mongoose');
const Car = require("../../models/car");
const Review = require("../../models/review");

exports.deleteRemoveReview = async (req, res) => {
    const reviewId = req.params.id;
    const session = await mongoose.startSession();
  
    try {
      await session.withTransaction(async () => {
        const reviewDetails = await Review.findById(reviewId).session(session);
        if (!reviewDetails) {
          throw { statusCode: 404, message: "Review not found" };
        }
  
        const carId = reviewDetails.car;
  
        await Review.deleteOne({ _id: reviewId }).session(session);
  
        const carDetails = await Car.findById(carId).session(session);
        if (carDetails) {
          carDetails.reviews = carDetails.reviews.filter(review => review.toString() !== reviewId);
          await carDetails.save({ session });
        }
  
        res.status(200).json({ message: "Review deleted successfully" });
      });
    } catch (error) {
      console.error(error);
  
      const statusCode = error.statusCode || 500;
      const errorMessage = error.message || "Internal server error";
  
      res.status(statusCode).json({ error: errorMessage });
    } finally {
      session.endSession();
    }
  };
