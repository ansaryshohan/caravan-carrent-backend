// const AllCarsModel = require("./allCars.model");
const {
  getAllCarBookingsFromDB,
  addACarBookingToDB,
  getAUserCarBookingsFromDB,
  deleteABookingOfUserFromDB,
} = require("./carBooking.service");

// get all the car booking data-------------
const getAllCarBookingsController = async (req, res) => {
  const { perPageData, pageNo } = req.query;
  // console.log(req.query,Number(pageNo),Number(perPageData));
  try {
    const { bookings, totalBookedCars, totalNoOfUserWhoBooked } =
      await getAllCarBookingsFromDB(Number(pageNo), Number(perPageData));
    return res.status(200).json({
      status: "success",
      data: { bookings, totalBookedCars, totalNoOfUserWhoBooked },
    });
  } catch (error) {
    return res.status(500).json({ status: "error", error });
  }
};
// get a user car booking data-------------
const getAUserCarBookingsController = async (req, res) => {
  const { perPageData, pageNo, userEmail } = req.query;
  try {
    const { bookings, totalNoOfBookingOfAUser } =
      await getAUserCarBookingsFromDB(
        Number(pageNo),
        Number(perPageData),
        userEmail
      );
    return res.status(200).json({
      status: "success",
      data: { bookings, totalNoOfBookingOfAUser },
    });
  } catch (error) {
    return res.status(500).json({ status: "error", error });
  }
};

// add a car booking in the database-----------
const addCarBookingsController = async (req, res) => {
  const bookingData = req.body;
  try {
    const { data, message } = await addACarBookingToDB(bookingData);
    console.log(data, message);
    return res.status(200).json({ status: "success", data, message });
  } catch (error) {
    return res.status(500).json({ status: "error", data: error.message });
  }
};

// delete a car booking from the database-----------
const deleteACarBookingController = async (req, res) => {
  const { bookedId } = req.params;
  const { userEmail } = req.body;
  // console.log(bookedId, userEmail);
  try {
    const { bookingDataAfterDelete, message } =
      await deleteABookingOfUserFromDB(userEmail, bookedId);
    // console.log(carDataAdding)
    return res
      .status(200)
      .json({ status: "success", data: bookingDataAfterDelete, message });
  } catch (error) {
    return res.status(500).json({ status: "error", data: error.message });
  }
};
module.exports = {
  getAllCarBookingsController,
  addCarBookingsController,
  getAUserCarBookingsController,
  deleteACarBookingController,
};
