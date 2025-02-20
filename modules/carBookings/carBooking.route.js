const express = require("express");
const router = express.Router();
const {
  getAllCarBookingsController,
  addCarBookingsController,
  getAUserCarBookingsController,
  deleteACarBookingController,
} = require("./carBooking.controller");

router.get("/all-bookings", getAllCarBookingsController);
router.get("/user-bookings", getAUserCarBookingsController);
router.post("/add-bookings", addCarBookingsController);
router.delete("/:bookedId", deleteACarBookingController);

module.exports = router;
