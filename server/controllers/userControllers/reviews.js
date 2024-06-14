const mongoose = require("mongoose");
const Review = require("../../models/review");
const Car = require("../../models/car");

exports.postAddReview = async (req, res) => {
    const { car, user, description, rating } = req.body;
    const session = await mongoose.startSession();
  
    try {
      await session.withTransaction(async () => {
        const carDetails = await Car.findById(car).session(session);
        if (!carDetails) {
          throw { statusCode: 404, message: "Car not found" };
        }
  
        const review = new Review({
          car,
          user,
          description,
          rating
        });
        await review.save({ session });
  
        carDetails.reviews.push({
          reviewId: review._id,
          user,
          description,
          rating
        });
        await carDetails.save({ session });
  
        res.status(201).json({ message: "Review added successfully" });
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

