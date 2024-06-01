const Rental = require("../../models/rental");
const Car = require("../../models/car");
const User = require("../../models/user");

exports.patchUpdateRental = async (req, res) => {
    const { rentalId, car, newStartDate, newEndDate, paid } = req.body
  
    try {
        const rentalDetails = await Rental.findById(rentalId);
        if (!rentalDetails) {
            return res.status(404).json({ message: "Rental not found" });
        }
    
        if (car && car !== rentalDetails.car.toString()) {
            const newCar = await Car.findById(car);
            if (!newCar) {
            return res.status(404).json({ message: "New car not found" });
            }
            rentalDetails.car = car;
        }

        let start = rentalDetails.startDate;
        let end = rentalDetails.endDate;

        if(newStartDate) {
            start = new Date(newStartDate);
        }
        if(newEndDate) {
            end = new Date(newEndDate);
        }
    
        if (newStartDate || newEndDate) {

            if (start >= end) {
                return res.status(400).json({ message: "End date should be greater than start date." });
            }
        
            const carDetails = await Car.findById(rentalDetails.car);
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
        
            carDetails.rentals = carDetails.rentals.filter(rental => rental.rentalId.toString() !== rentalDetails._id.toString());
            carDetails.rentals.push({
              rentalId: rentalId,
              startDate: start,
              endDate: end
            });
            await carDetails.save();
    
            const userDetails = await User.findById(rentalDetails.user);
            userDetails.rentals = userDetails.rentals.filter(rental => rental.rentalId.toString() !== rentalDetails._id.toString());
            userDetails.rentals.push({
              rentalId: rentalId,
              startDate: start,
              endDate: end,
              price: newPrice
            });
            await userDetails.save();
        
        }

        if (paid !== undefined) rentalDetails.paid = paid; 
        await rentalDetails.save();
        res.status(200).json({ message: "Rental updated successfully" }); 

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
  
  