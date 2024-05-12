const Car = require("../../models/car");

exports.postAddCarRental = async (req, res) => {

  const { model, amount } = req.body;
  console.log(req.body);
  const car = new Car({
    model,
    amount,
  });
  try {
    await car.save();
    res.status(201).json({ message: "Car added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.putUpdateCar = async (req, res) => {
    
}
