const mongoose = require("mongoose");
const Roles = require("../utils/roles");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  email: {
    required: [true, "Email is required"],
    unique: true,
    type: String,
    validate: {
      validator: function (v) {
        return /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    required: true,
    type: String,
  },
  roles: {
    type: [String],
    enum: [Roles.ADMIN, Roles.USER],
    default: [Roles.USER]
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
        },
      }
  ], 
  default: []
  }
});

module.exports = mongoose.model("User", userSchema);
