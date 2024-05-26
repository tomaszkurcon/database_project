const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const carSchema = new Schema({
  brand: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  pricePerDay: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  fuelType: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    minimum: 1,
    required: true
  },
  rentals:  { 
    type: [
      {
        rentalId: {
          type: Schema.Types.ObjectId,
          ref: "Rental",
          required: true
        },
        startDate: {
          type: Date,
          required: true
        },
        endDate: {
          type: Date,
          required: true
        }
      }
  ], 
  default: []
  },
  reviews: {
    type: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true
        },
        rating: {
          type: Number,
          required: true
        },
        description: {
          type: String,
          required: true
        }
      }
    ],
    default: []
  }
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("Car", carSchema);
