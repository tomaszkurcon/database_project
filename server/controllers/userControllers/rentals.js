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

    if(start >= end){
      return res.status(400).json({
        message: "End date should be greater than start date."
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.putUpdateRentalPaidStatus = async (req, res) => {
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

exports.putUpdateRentalDates = async (req, res) => {
  const { rentalId, newStartDate, newEndDate } = req.body;

  try {
    const rentalDetails = await Rental.findById(rentalId);
    if (!rentalDetails) {
      return res.status(404).json({ message: "Rental not found" });
    }

    const carDetails = await Car.findById(rentalDetails.car._id);
    if (!carDetails) {
      return res.status(404).json({ message: "Car not found" });
    }

    const userDetails = await User.findById(rentalDetails.user);

    const start = new Date(newStartDate);
    const end = new Date(newEndDate);

    if (start >= end) {
      return res.status(400).json({ message: "End date should be greater than start date." });
    }

    const overlappingRentals = carDetails.rentals.filter((rental) => {
      return start <= rental.endDate && end >= rental.startDate && rental.rentalId.toString() !== rentalId;
    });

    if (overlappingRentals.length >= carDetails.quantity) {
      return res.status(400).json({
        message: "Car is already rented for the requested dates."
      });
    }
    
    const pricePerDay = carDetails.pricePerDay;
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 2; 
    const newPrice = diffDays * pricePerDay;

    rentalDetails.startDate = start;
    rentalDetails.endDate = end;
    rentalDetails.price = newPrice;
    await rentalDetails.save();

    carDetails.rentals = carDetails.rentals.filter(rental => rental.rentalId.toString() !== rentalDetails._id.toString());
    carDetails.rentals.push({
      rentalId: rentalId,
      startDate: start,
      endDate: end
    });
    await carDetails.save();

    userDetails.rentals = userDetails.rentals.filter(rental => rental.rentalId.toString() !== rentalDetails._id.toString());
    userDetails.rentals.push({
      rentalId: rentalId,
      startDate: start,
      endDate: end,
      price: newPrice
    });
    await userDetails.save();

    res.status(200).json({
      message: "Rental updated successfully",
      newStartDate: start,
      newEndDate: end,
      newPrice: newPrice
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteRemoveRental = async (req, res) => {

  const params = req.params;
  const rentalId =  params.id;

  try {
    const rentalDetails = await Rental.findById(rentalId);
    if (!rentalDetails) {
      return res.status(404).json({
        message: "Rental not found"
      });
    }

    const carDetails = await Car.findById(rentalDetails.car);
    const userDetails = await User.findById(rentalDetails.user);
  
    carDetails.rentals = carDetails.rentals.filter(rental => rental.rentalId.toString() !== rentalId);
    await carDetails.save();

    userDetails.rentals = userDetails.rentals.filter(rental => rental.rentalId.toString() !== rentalId);
    await userDetails.save();

    await Rental.deleteOne({ _id: rentalId });

    res.status(200).json({ message: "Rental removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

