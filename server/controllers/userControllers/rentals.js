const Rental = require("../../models/rental");
const Car = require("../../models/car");

exports.postAddRental = async (req, res) => {
  const { car, startDate, endDate, user, paid } = req.body;

  try {
    const overlappingRentals = await Rental.find({
      car: car,
      startDate: { $lte: endDate }, 
      endDate: { $gte: startDate }
    });

    if (overlappingRentals.length > 0) {
      return res.status(400).json({
        message: "Car is already rented for the requested dates."
      });
    }

    const carDetails = await Car.findById(car);
    if (!carDetails) {
      return res.status(404).json({
        message: "Car not found"
      });
    }

    pricePerDay = carDetails.pricePerDay;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 2; 
    const price = diffDays * pricePerDay;

    const rental = new Rental({
      car, 
      user, 
      startDate, 
      endDate, 
      price, 
      paid
    });

    await rental.save();
    res.status(201).json({ message: "Rental added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateRentalPaidStatus = async (req, res) => {
  const { rentalId } = req.body;

  try {
      const rental = await Rental.findById(rentalId);

      if (!rental) {
          return res.status(404).json({ message: "Rental not found" });
      }

      rental.paid = true;
      await rental.save();

      res.status(200).json({
          message: "Rental paid status updated successfully"
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
  }
};
