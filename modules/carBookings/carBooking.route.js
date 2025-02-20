const express = require("express");
const verifyToken = require("../../middlewares/verifyToken");
const router = express.Router();
const {
  getAllCarBookingsController,
  addCarBookingsController,
  getAUserCarBookingsController,
  deleteACarBookingController,
} = require("./carBooking.controller");

router.get("/all-bookings", getAllCarBookingsController);
router.get("/user-bookings",verifyToken, getAUserCarBookingsController);
router.post("/add-bookings", verifyToken, addCarBookingsController);
router.delete("/:bookedId",verifyToken, deleteACarBookingController);

module.exports = router;
