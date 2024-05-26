const Car = require("../../models/car");

exports.postAddCar = async (req, res) => {
  const { 
    brand, 
    model, 
    pricePerDay, 
    year, 
    color,
    fuelType,
    quantity,
    rentals,
    ratings  
    } = req.body;
  const car = new Car({
    brand, 
    model, 
    pricePerDay, 
    year, 
    color,
    fuelType,
    quantity,
    rentals,
    ratings
  });
  try {
    await car.save();
    res.status(201).json({ message: "Car added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.putUpdateCar = async (req, res) => {};
