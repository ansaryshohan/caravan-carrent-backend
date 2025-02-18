const AllCarsModel = require("./allCars.model");

const getTopCarDataFromDB = async () => {
  try {
    const topCars = await AllCarsModel.find({})
      .sort({ dailyRentalPrice: -1 })
      .limit(6);
    // console.log(topCars);
    return topCars;
  } catch (error) {
    throw new Error(error.message);
  }
};
// get all the cars
const getAllCarsDataFromDB = async (pageNo = 0, perPageData = 0) => {
  try {
    const allCars = await AllCarsModel.find({})
      .skip(pageNo * perPageData)
      .limit(perPageData);
    // console.log(allCars);
    const totalNoOfCars = await AllCarsModel.countDocuments({
      adminApproval: "approved",
    });
    // console.log(totalNoOfCars);
    return { allCars, totalNoOfCars };
  } catch (error) {
    throw new Error(error.message);
  }
};
// get a single car by id
const getSingleCarDataFromDB = async (carId) => {
  try {
    const singleCar = await AllCarsModel.findOne({_id:carId})
    return singleCar;
  } catch (error) {
    throw new Error(error.message);
  }
};
// user all added car based on email
const getAllCarsByAUserDataFromDB = async (userEmail) => {
  try {
    const allCarsByUser = await AllCarsModel.find({
      "addedBy.email": userEmail,
    });
    // console.log(allCars);
    const totalNoOfCars = await AllCarsModel.countDocuments({
      "addedBy.email": userEmail,
    });
    // console.log(totalNoOfCars);
    return { allCarsByUser, totalNoOfCars };
  } catch (error) {
    throw new Error(error.message);
  }
};
// add car to the database
const addACarToDB = async (carData) => {
  try {
    const dataAdding = new AllCarsModel(carData);
    console.log(dataAdding);
    await dataAdding.save();
    return dataAdding;
  } catch (error) {
    throw new Error(error.message);
  }
};
// delete a car from the database
const deleteACarFromDB = async (carId, userEmail) => {
  try {
    const findCar = await AllCarsModel.findOne({ _id: carId });
    if (findCar) {
      // const userEmail= findCar.addedBy.email;
      const deletedData = await AllCarsModel.deleteOne({ _id: carId });
      const carDataAfterDelete = await AllCarsModel.find({
        "addedBy.email": userEmail,
      });

      return { deletedData, carDataAfterDelete };
    }
    return { deletedData: { deletedCount: 0 }, carDataAfterDelete: null };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getAllCarsDataFromDB,
  getSingleCarDataFromDB,
  getTopCarDataFromDB,
  addACarToDB,
  getAllCarsByAUserDataFromDB,
  deleteACarFromDB,
};
