const Review = require("../../models/review");

exports.postAddReview = async (req, res) => {
    const { car, user, description, rating  } = req.body;
    const review = new Review({
        car,
        user,
        description,
        rating
    });
    try {
        await review.save();
        res.status(201).json({ message: "Review added successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.putUpdateReview = async (req, res) => {};
