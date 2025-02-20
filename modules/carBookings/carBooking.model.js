const { Schema, model } = require("mongoose");

const bookedCarSchema = new Schema({
  carId: { type: Schema.Types.ObjectId, required: true }, // Reference to Car model
  bookingDate: { type: Date, required: true },
  bookingTime: { type: String, required: true },
  isConfirmed: { type: Boolean, required: true },
});

const allCarBookingsSchema = new Schema(
  {
    userEmail: { type: String, required: true },
    bookedCars: [bookedCarSchema],
  },
  { timestamps: true }
);

const AllCarsBookingModel = model("CarBooking", allCarBookingsSchema);

module.exports = AllCarsBookingModel;
