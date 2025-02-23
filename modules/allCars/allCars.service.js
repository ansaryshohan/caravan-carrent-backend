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
    const totalNoOfCars = await AllCarsModel.countDocuments();
    // console.log(totalNoOfCars);
    return { allCars, totalNoOfCars };
  } catch (error) {
    throw new Error(error.message);
  }
};
// get all the cars
const getAvailableCarsDataFromDB = async (
  pageNo = 0,
  perPageData = 0,
  priceSort = "",
  carType = "",
  searchText = ""
) => {
  const carTypesMap = {
    sedan: "sedan",
    suv: "suv",
    hatchback: "hatchback",
    coupe: "coupe",
    convertible: "convertible",
    pickup: "pickup",
    minivan: "minivan",
    crossover: "crossover",
    sports: "sports",
    luxury: "luxury",
    electric: "electric",
    hybrid: "hybrid",
    wagon: "wagon",
    van: "van",
    offroad: "offroad",
    classic: "classic",
    supercar: "supercar",
    compact: "compact",
    midsize: "midsize",
    fullsize: "fullsize",
  };

  // Converting carType to lowercase to handle case sensitivity
  const normalizedCarType = carType?.trim().toLowerCase();

  // Setting the base query
  const carDataFindQuery = {
    availability: true,
    adminApproval: "approved",
  };

  // If carType exists in the map, than adding it to the query
  if (carTypesMap[normalizedCarType]) {
    carDataFindQuery.carType = {
      $regex: `^${carTypesMap[normalizedCarType]}$`,
      $options: "i",
    };
  }

  // **Search in carModel field only**
  if (searchText?.trim()) {
    carDataFindQuery.carModel = { $regex: searchText, $options: "i" };
  }
  // console.log(carDataFindQuery);

  const priceSortQuery = {};
  if (priceSort === "price_asc") {
    priceSortQuery.dailyRentalPrice = 1;
  }
  if (priceSort === "price_dsc") {
    priceSortQuery.dailyRentalPrice = -1;
  }
  // console.log(priceSortQuery);
  try {
    const allCars = await AllCarsModel.find(carDataFindQuery)
      .sort(priceSortQuery)
      .skip(pageNo * perPageData)
      .limit(perPageData);
    // console.log(allCars);
    const totalNoOfCars = await AllCarsModel.countDocuments(carDataFindQuery);
    // console.log(totalNoOfCars);
    return { allCars, totalNoOfCars };
  } catch (error) {
    throw new Error(error.message);
  }
};
// get a single car by id
const getSingleCarDataFromDB = async (carId) => {
  try {
    const singleCar = await AllCarsModel.findOne({ _id: carId });
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

// get car type
const getAllCarTypesFromDB = async () => {
  const allCarsTypes = await AllCarsModel.aggregate([
    {
      $match: {
        adminApproval: "approved",
      },
    },
    {
      $group: {
        _id: "$carType", // Group by carType to remove duplicates
        carType: { $first: "$carType" }, // Keep the first carType value
        id: { $first: "$_id" }, // Keep the first _id for each type
      },
    },
    {
      $project: {
        _id: "$id",
        carType: "$carType",
      },
    },
  ]);
  // console.log(allCarsTypes);
  return allCarsTypes;
};
// get car Model according to search
const getAllCarModelAccordingSearchFromDB = async (searchText = "") => {
  const allCarsModels = await AllCarsModel.aggregate([
    {
      $search: {
        index: "carModelIndex",
        text: {
          query: searchText,
          path: {
            wildcard: "*",
          },
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        carModel: { $first: "$carModel" },
      },
    },
    {
      $project: {
        _id: "$_id",
        carModel: "$carModel",
      },
    },
  ]);
  // console.log(allCarsModels);
  return allCarsModels;
};
// add car to the database
const addACarToDB = async (carData) => {
  try {
    const dataAdding = new AllCarsModel(carData);
    // console.log(dataAdding);
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
  getAvailableCarsDataFromDB,
  getTopCarDataFromDB,
  getAllCarTypesFromDB,
  getAllCarModelAccordingSearchFromDB,
  addACarToDB,
  getAllCarsByAUserDataFromDB,
  deleteACarFromDB,
};
