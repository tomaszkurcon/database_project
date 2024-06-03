const Car = require("../../models/car");
const Review = require("../../models/review");

exports.deleteRemoveReview = async (req, res) => {
    const params = req.params;
    const reviewId = params.id;

    try {
      
        const reviewDetails = await Review.findById(reviewId);
        if (!reviewDetails) {
            return res.status(404).json({ message: "Review not found" });
        }
        const car = reviewDetails.car;
        await Review.deleteOne({ _id: reviewId });

        const carDetails = await Car.findById(car);
        if (!carDetails) {
            return res.status(200).json({ message: "Car not found, but review deleted from reviews" });
        }

        carDetails.reviews = carDetails.reviews.filter(review => review.reviewId.toString() !== reviewId);
        await carDetails.save();

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
