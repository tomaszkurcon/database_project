const Rental = require("../../models/rental");
const Car = require("../../models/car");
const User = require("../../models/user");

exports.postAddRental = async (req, res) => {
  const { car, startDate, endDate, user, paid } = req.body;

  try {

    const start = new Date(startDate);
    const end = new Date(endDate);

    const carDetails = await Car.findById(car);
    if (!carDetails) {
      return res.status(404).json({
        message: "Car not found"
      });
    }

    const userDetails = await User.findById(user);
    if (!userDetails) {
      return res.status(404).json({
        message: "User not found"
      });
    }
    
    const overlappingRentals = carDetails.rentals.filter((rental) => {
      return start <= rental.endDate && end >= rental.startDate;
    });

    if (overlappingRentals.length >= carDetails.quantity) {
      return res.status(400).json({
        message: "Car is already rented for the requested dates."
      });
    }

    const pricePerDay = carDetails.pricePerDay;

    if (start < end){
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

      carDetails.rentals.push({
        rentalId: rental._id,
        startDate,
        endDate
      });
    
      await carDetails.save();
      
      userDetails.rentals.push({
        rentalId: rental._id,
        startDate,
        endDate,
        price
      });

      await userDetails.save();

      res.status(201).json({ message: "Rental added successfully" });
    }
    else{
      return res.status(400).json({
        message: "End date should be greater than start date."
      });
    }
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
