const Rental = require("../../models/rental");
const Car = require("../../models/car");
const User = require("../../models/user");
const { mongoose } = require("mongoose");

exports.postAddRental = async (req, res) => {
  const { car, startDate, endDate, user, paid } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {

    const start = new Date(startDate);
    const end = new Date(endDate);

    const carDetails = await Car.findById(car).session(session);
    if (!carDetails) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        message: "Car not found"
      });
    }

    const userDetails = await User.findById(user).session(session);
    if (!userDetails) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        message: "User not found"
      });
    }

    if(start >= end){
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "End date should be greater than start date."
      });
    }
    
    const overlappingRentals = carDetails.rentals.filter((rental) => {
      return start <= rental.endDate && end >= rental.startDate;
    });

    if (overlappingRentals.length >= carDetails.quantity) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "Car is already rented for the requested dates."
      });
    }

    const pricePerDay = carDetails.pricePerDay;
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
    const price = diffDays * pricePerDay;
    const rental = new Rental({
      car, 
      user, 
      startDate, 
      endDate, 
      price, 
      paid
    });
    await rental.save({ session });

    carDetails.rentals.push({
      rentalId: rental._id,
      startDate,
      endDate
    });
    await carDetails.save({ session });
    userDetails.rentals.push({
      rentalId: rental._id,
      startDate,
      endDate,
      price
    });
    await userDetails.save({ session });
    await session.commitTransaction();
    session.endSession();
    res.status(201).json({ message: "Rental added successfully" });
  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.patchUpdateRentalPaidStatus = async (req, res) => {
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

exports.patchUpdateRentalDates = async (req, res) => {
  const { rentalId, newStartDate, newEndDate } = req.body;
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const rentalDetails = await Rental.findById(rentalId).session(session);
    
      if (!rentalDetails) {
        throw { statusCode: 404, message: "Rental not found" };
      }

      const carDetails = await Car.findById(rentalDetails.car._id).session(session);
      if (!carDetails) {
        throw { statusCode: 404, message: "Car not found" };
      }

      const userDetails = await User.findById(rentalDetails.user).session(session);

      const start = new Date(newStartDate);
      const end = new Date(newEndDate);
      
      if (rentalDetails.paid === true) {
        throw { statusCode: 400, message: "Cannot update dates for a paid rental." };
      }

      if (start >= end) {
        throw { statusCode: 400, message: "End date should be greater than start date." };
      }

      const overlappingRentals = carDetails.rentals.filter((rental) => {
        return start <= rental.endDate && end >= rental.startDate && rental.rentalId.toString() !== rentalId;
      });

      if (overlappingRentals.length >= carDetails.quantity) {
        throw { statusCode: 400, message: "Car is already rented for the requested dates." };
      }

      const pricePerDay = carDetails.pricePerDay;
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
      const newPrice = diffDays * pricePerDay;

      rentalDetails.startDate = start;
      rentalDetails.endDate = end;
      rentalDetails.price = newPrice;
      await rentalDetails.save({ session });

      carDetails.rentals = carDetails.rentals.filter(rental => rental.rentalId.toString() !== rentalDetails._id.toString());
      carDetails.rentals.push({
        rentalId,
        startDate: start,
        endDate: end
      });
      await carDetails.save({ session });

      userDetails.rentals = userDetails.rentals.filter(rental => rental.rentalId.toString() !== rentalDetails._id.toString());
      userDetails.rentals.push({
        rentalId,
        startDate: start,
        endDate: end,
        price: newPrice
      });
      await userDetails.save({ session });

      res.status(200).json({
        message: "Rental updated successfully",
        newStartDate: start,
        newEndDate: end,
        newPrice
      });
    });
  } catch (error) {
    console.error(error);

    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || "Internal server error";

    res.status(statusCode).json({ error: errorMessage });
  } finally {
    session.endSession();
  }
};

exports.deleteRemoveRental = async (req, res) => {
  const rentalId = req.params.id;
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const rentalDetails = await Rental.findById(rentalId).session(session);
      if (!rentalDetails) {
        throw { statusCode: 404, message: "Rental not found" };
      }

      const carDetails = await Car.findById(rentalDetails.car).session(session);
      if (!carDetails) {
        throw { statusCode: 404, message: "Car not found" };
      }

      const userDetails = await User.findById(rentalDetails.user).session(session);
      
      carDetails.rentals = carDetails.rentals.filter(rental => rental.rentalId.toString() !== rentalId);
      await carDetails.save({ session });

      userDetails.rentals = userDetails.rentals.filter(rental => rental.rentalId.toString() !== rentalId);
      await userDetails.save({ session });
      await Rental.deleteOne({ _id: rentalId }).session(session);

      res.status(200).json({ message: "Rental removed successfully" });
    });
  } catch (error) {
    console.error(error);

    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || "Internal server error";

    res.status(statusCode).json({ error: errorMessage });
  } finally {
    session.endSession();
  }
};

exports.getUserRentalHistory = async (req, res) => {

  const params = req.params; 
  const userId = params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }
    res.status(200).json({
      userId,
      rentalHistory: user.rentals
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal server error"
    });
  }
};


