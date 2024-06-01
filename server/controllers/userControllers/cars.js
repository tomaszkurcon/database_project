const Car = require("../../models/car");

exports.getTopRatedCars = async (req, res) => {
  try {
    const cars = await Car.aggregate([
      {
        $addFields: {
          reviewCount: { $size: "$reviews" }
        }
      },
      {
        $unwind: {
          path: "$reviews",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: "$_id", 
          avgRating: { $avg: "$reviews.rating" }, 
          numOfRatings: { $first: "$reviewCount" }, 
          brand: { $first: "$brand" },
          model: { $first: "$model" },
          pricePerDay: { $first: "$pricePerDay" },
          year: { $first: "$year" },
          color: { $first: "$color" },
          fuelType: { $first: "$fuelType" },
          quantity: { $first: "$quantity" }
        }
      },
      {
        $sort: {
          count: -1, 
          avgRating: -1 
        }
      }
    ]);

    if (cars.length === 0) {
      return res.status(404).json({ message: "No cars found" });
    }

    res.status(200).json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getMostRentedCars = async (req, res) => {
    try {
      const cars = await Car.aggregate([
        {
          $addFields: {
            rentalCount: { $size: "$rentals" }
          }
        },
        {
          $sort: {
            rentalCount: -1, 
          }
        },
        {
          $project: {
            _id: 1, 
            brand: 1, 
            model: 1, 
            pricePerDay: 1, 
            year: 1, 
            color: 1, 
            fuelType: 1, 
            quantity: 1,
            rentalCount: 1
          }
        }
      ]);
  
      if (cars.length === 0) {
        return res.status(404).json({ message: "No cars found" });
      }
  
      res.status(200).json(cars);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  exports.getSortedCarsByPrice = async (req, res) => {
    const sortParam = req.query.sort; 
  
    let sortOrder;
    if (sortParam === 'desc') {
      sortOrder = -1; 
    } else if (sortParam === 'asc') {
      sortOrder = 1; 
    } else {
      return res.status(400).json({ message: "Invalid sort parameter. Use 'desc' or 'asc'." });
    }
  
    try {
      const cars = await Car.aggregate([
        {
          $sort: {
            pricePerDay: sortOrder 
          }
        },
        {
          $project: {
            _id: 1, 
            brand: 1, 
            model: 1, 
            pricePerDay: 1, 
            year: 1, 
            color: 1, 
            fuelType: 1, 
            quantity: 1
          }
        }
      ]);
  
      if (cars.length === 0) {
        return res.status(404).json({ message: "No cars found" });
      }
  
      res.status(200).json(cars);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };