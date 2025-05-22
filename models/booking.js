const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  startDate: Date,
  endDate: Date,
  guests: {
    adults: Number,
    children: Number,
  },
  addons: [String],
  fullName: String,
  paymentMethod: String,
  totalPrice: Number,
  status: {
    type: String,
    default: "pending",
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
