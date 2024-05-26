const Review = require("../../models/review");
const Car = require("../../models/car");

exports.postAddReview = async (req, res) => {
    const { car, user, description, rating  } = req.body;

    
    try {
        
        const carDetails = await Car.findById(car);
        if (!carDetails) {
            return res.status(404).json({
                message: "Car not found"
            });
        }

        const review = new Review({
            car,
            user,
            description,
            rating
        });
        await review.save();
  
        carDetails.reviews.push({
            user,
            description,
            rating
        });
        await carDetails.save();

        res.status(201).json({ message: "Review added successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.putUpdateReview = async (req, res) => {};
