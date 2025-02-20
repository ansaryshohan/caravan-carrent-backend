// const AllCarsModel = require("./allCars.model");
const {
  getAllCarBookingsFromDB,
  addACarBookingToDB,
  getAUserCarBookingsFromDB,
  deleteABookingOfUserFromDB,
} = require("./carBooking.service");

// TODO:: This will be only accessed by admin
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
  if (userEmail !== req?.user?.userEmail) {
    return res
      .status(403)
      .json({ status: "success", data: null, message: "Forbidden access" });
  }
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
      message: "Successful data access",
    });
  } catch (error) {
    return res.status(500).json({ status: "error", error });
  }
};

// add a car booking in the database-----------
const addCarBookingsController = async (req, res) => {
  const bookingData = req.body;
  // console.log(bookingData?.userEmail,req?.user?.userEmail)
  // check if the jwt token data matches with the booking userEmail
  if (bookingData?.userEmail !== req?.user?.userEmail) {
    return res
      .status(403)
      .json({ status: "success", data: null, message: "Forbidden access" });
  }
  try {
    const { data, message } = await addACarBookingToDB(bookingData);
    // console.log(data, message);
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
  if(userEmail !== req?.user?.userEmail){
    return res.status(403).json({ status: "success", data:null, message:"Forbidden access" });
  }
  try {
    const { bookingDataAfterDelete, message } =
      await deleteABookingOfUserFromDB(userEmail, bookedId);
    // console.log(carDataAdding)
    return res
      .status(200)
      .json({ status: "success", data: bookingDataAfterDelete, message });
  } catch (error) {
    return res.status(500).json({ status: "error", data: error.message, message:"error occurred" });
  }
};
module.exports = {
  getAllCarBookingsController,
  addCarBookingsController,
  getAUserCarBookingsController,
  deleteACarBookingController,
};
