const { Schema, model } = require("mongoose");

const allCarsSchema = new Schema({
  carModel: { type: String, required: true },
  carType: { type: String, required: true },
  year: { type: String, required: true },
  dailyRentalPrice: { type: Number, required: true },
  availability: { type: Boolean, default: true },
  vehicleRegistrationNumber: { type: String, required: true, unique: true },
  features: [{ type: String }], // Array of strings
  description: { type: String },
  bookingCount: { type: Number, default: 0 },
  imageUrl: { type: String },
  location: { type: String },
  adminApproval: {
    type: String,
    enum: ["pending", "approved"],
    default: "pending", // Default value
  },
  carInfo: {
    engine: String,
    fuel: String,
    mileage: String,
    transmission: String,
    doors: Number,
    passenger: Number,
  },
  addedBy: {
    userId: String,
    name: String,
    email: String,
  },
  dateAdded: { type: Date, default: Date.now },
  bookingStatus: { type: String, default: "available" },
});

const AllCarsModel = model("AllCars", allCarsSchema);

module.exports = AllCarsModel;
