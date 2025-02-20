const AllCarsBookingModel = require("./carBooking.model");

// get all the cars bookings
const getAllCarBookingsFromDB = async (pageNo = 0, perPageData = 0) => {
  const skip = Number(pageNo) * Number(perPageData);
  try {
    const bookings = await AllCarsBookingModel.aggregate([
      {
        $unwind: "$bookedCars", // Unwind the bookedCars array
      },
      {
        $lookup: {
          from: "allcars",
          localField: "bookedCars.carId",
          foreignField: "_id",
          as: "bookedCars",
        },
      },
      { $unwind: "$bookedCars" },
      {
        $skip: skip,
      },
      {
        $limit: Number(perPageData),
      },
    ]);
    console.log(bookings);
    // user count who booked
    const totalNoOfUserWhoBooked = await AllCarsBookingModel.countDocuments();
    // all the booked cars count
    const totalBookedCars = await getTotalBookedCarsCount();
    // console.log(totalNoOfCars);
    return { bookings, totalBookedCars, totalNoOfUserWhoBooked };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
// get a user cars bookings
const getAUserCarBookingsFromDB = async (
  pageNo = 0,
  perPageData = 0,
  userEmail
) => {
  const skip = Number(pageNo) * Number(perPageData);
  try {
    const bookings = await AllCarsBookingModel.aggregate([
      {
        $match: { userEmail },
      },
      {
        $lookup: {
          from: "allcars",
          localField: "bookedCars.carId",
          foreignField: "_id",
          as: "carDetails",
        },
      },
      // Merge car details into bookedCars
      {
        $set: {
          bookedCars: {
            $map: {
              input: { $slice: ["$bookedCars", skip, perPageData] },
              as: "car",
              in: {
                _id: "$$car._id",
                bookingDate: "$$car.bookingDate",
                bookingTime: "$$car.bookingTime",
                isConfirmed: "$$car.isConfirmed",
                carData: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$carDetails",
                        as: "carDetail",
                        cond: { $eq: ["$$carDetail._id", "$$car.carId"] },
                      },
                    },
                    0,
                  ],
                },
              },
            },
          },
        },
      },

      // Remove the extra carDetails array
      { $unset: "carDetails" },
    ]);
    // console.log(bookings);
    // user car booking count
    const totalNoOfBookingOfAUserData = await AllCarsBookingModel.aggregate([
      {
        $match: { userEmail: userEmail },
      },
      {
        $project: {
          _id: 0,
          totalBookings: { $size: "$bookedCars" }, // Count bookedCars array length
        },
      },
    ]);
    // console.log(totalNoOfBookingOfAUserData);
    const totalNoOfBookingOfAUser =
      totalNoOfBookingOfAUserData.length > 0
        ? totalNoOfBookingOfAUserData[0].totalBookings
        : 0;
    // console.log(totalNoOfCars);
    return { bookings, totalNoOfBookingOfAUser };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

// add car to the database
const addACarBookingToDB = async (bookingData) => {
  try {
    const { userEmail, bookedCars } = bookingData;

    // Check if the user already exists in the collection
    let existingBooking = await AllCarsBookingModel.findOne({ userEmail });

    if (!existingBooking) {
      // If user not found, add the new booking document
      const newBooking = new AllCarsBookingModel({
        userEmail,
        bookedCars,
      });

      await newBooking.save();
      return { data: newBooking, message: "Booking successful" };
    }

    // Check if the same carId, bookingDate, and bookingTime already exist
    const isAlreadyBooked = existingBooking?.bookedCars.some(
      (car) =>
        car.carId.toString() === bookedCars[0].carId &&
        car.bookingDate.toISOString() ===
          new Date(bookedCars[0].bookingDate).toISOString()
      // &&
      // car.bookingTime === bookedCars[0].bookingTime
    );

    if (!isAlreadyBooked) {
      // Add new booking entry for this user
      const updatedBooking = await AllCarsBookingModel.findOneAndUpdate(
        { userEmail },
        { $push: { bookedCars: bookedCars[0] } }, // Add new booking object
        { new: true } // Return the updated document
      );

      return { data: updatedBooking, message: "Booking successful" };
    }

    // If booking already exists, return the existing data
    return {
      data: existingBooking,
      message: "Can't book the same car twice the same day",
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// total booked cars count
const getTotalBookedCarsCount = async () => {
  try {
    const result = await AllCarsBookingModel.aggregate([
      {
        $project: {
          totalBookedCarsPerUser: { $size: "$bookedCars" }, // Count booked cars per user
        },
      },
      {
        $group: {
          _id: null,
          totalBookedCars: { $sum: "$totalBookedCarsPerUser" }, // Sum all counts
        },
      },
    ]);

    return result[0]?.totalBookedCars || 0; // Return total count, default to 0 if empty
  } catch (error) {
    console.error("Error fetching total booked cars:", error);
    throw new Error(error.message);
  }
};

// delete a user car booking from the database
const deleteABookingOfUserFromDB = async (userEmail, bookedId) => {
  try {
    const findCar = await AllCarsBookingModel.findOne({
      userEmail,
    });
    // console.log(findCar)
    if (findCar) {
      const bookingDataAfterDelete = await AllCarsBookingModel.findOneAndUpdate(
        { userEmail },
        { $pull: { bookedCars: { _id: bookedId } } },
        { new: true } // Return the updated document
      );

      // console.log(bookingDataAfterDelete);
      if (findCar?.bookedCars?.length !== bookingDataAfterDelete?.bookedCars?.length) {
        return {
          bookingDataAfterDelete,
          message: "Booking deleted successfully",
        };
      }

      return { bookingDataAfterDelete, message: "No booking found" };
    }
    return {
      bookingDataAfterDelete: null,
      message: "No booking found for this user",
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getAllCarBookingsFromDB,
  addACarBookingToDB,
  getAUserCarBookingsFromDB,
  deleteABookingOfUserFromDB,
};
