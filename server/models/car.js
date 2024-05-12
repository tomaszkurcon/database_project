const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const carSchema = new Schema({
  model: {
    type: String,
    required: true,
  },
  amount: {
    required: true,
    type: Number,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Car", carSchema);
