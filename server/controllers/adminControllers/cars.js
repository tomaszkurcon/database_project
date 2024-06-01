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

exports.patchUpdateCar = async (req, res) => {
  const {
    id,
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

  try {
    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    if (brand) car.brand = brand;
    if (model) car.model = model;
    if (pricePerDay) car.pricePerDay = pricePerDay;
    if (year) car.year = year;
    if (color) car.color = color;
    if (fuelType) car.fuelType = fuelType;
    if (quantity) car.quantity = quantity;
    if (rentals) car.rentals = rentals;
    if (ratings) car.ratings = ratings;

    await car.save(); 

    res.status(200).json({ message: "Car updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteRemoveCar = async (req, res) => {
  const { id } = req.params; 

  try {
    const car = await Car.findById(id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    await Car.deleteOne({ _id: id });

    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


