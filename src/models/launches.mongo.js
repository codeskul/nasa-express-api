const mongoose = require("mongoose");

const launchSchema = new mongoose.Schema({
  flightNumber: { type: Number, required: true },
  mission: { type: String, required: true },
  rocket: { type: String, required: true },
  launchDate: { type: Date, required: true },
  target: { type: String },
  customers: { type: [String] },
  upcoming: { type: Boolean, require: true },
  success: { type: Boolean, require: true, default: true },
});

// Connect launchSchema with the "launches" collection
module.exports = mongoose.model("Launch", launchSchema);
