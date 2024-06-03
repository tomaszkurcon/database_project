const mongoose = require("mongoose");
const rental = require("./rental");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  email: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
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
        },
        price: {
          type: Number,
          required: true
        }
      }
  ], 
  default: []
  }
});

module.exports = mongoose.model("User", userSchema);
