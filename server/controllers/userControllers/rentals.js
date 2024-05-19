const Rental = require("../../models/rental");

exports.postAddRental = async (req, res) => {
  const { car, start, end, user, price, paid } = req.body;
  const rental = new Rental({
    car, 
    user, 
    start, 
    end, 
    price, 
    paid
  });
  try {
    await rental.save();
    res.status(201).json({ message: "Rental added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.putUpdateRental = async (req, res) => {};
