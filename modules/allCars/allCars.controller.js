const AllCarsModel = require("./allCars.model");
const {
  getTopCarDataFromDB,
  getAllCarsDataFromDB,
  getAvailableCarsDataFromDB,
  getSingleCarDataFromDB,
  getAllCarsByAUserDataFromDB,
  getAllCarTypesFromDB,
  getAllCarModelAccordingSearchFromDB,
  addACarToDB,
  deleteACarFromDB,
} = require("./allCars.service");

// get all the car data-------------
const getAllCarsController = async (req, res) => {
  const { perPageData, pageNo } = req.query;
  // console.log(req.query,Number(pageNo),Number(perPageData));
  try {
    const { allCars, totalNoOfCars } = await getAllCarsDataFromDB(
      Number(pageNo),
      Number(perPageData)
    );
    return res
      .status(200)
      .json({ status: "success", data: { allCars, totalNoOfCars } });
  } catch (error) {
    return res.status(500).json({ status: "success", error });
  }
};
// get all available cars data-------------
const getAllAvailableCarsController = async (req, res) => {
  const { perPageData, pageNo,priceSort,carType,searchText } = req.query;
  // console.log(req.query);
  try {
    const { allCars, totalNoOfCars } = await getAvailableCarsDataFromDB(
      Number(pageNo),
      Number(perPageData),
      priceSort,
      carType,
      searchText
    );
    return res
      .status(200)
      .json({ status: "success", data: { allCars, totalNoOfCars } });
  } catch (error) {
    return res.status(500).json({ status: "error", error });
  }
};
// get all available cars Types data-------------
const getAllCarsTypesController = async (req, res) => {
  try {
    const carTypesData = await getAllCarTypesFromDB();
    return res
      .status(200)
      .json({ status: "success", data: carTypesData, message:"car types got successfully"});
  } catch (error) {
    return res.status(500).json({ status: "error", error });
  }
};
// get all available carsModels according to search-------------
const getAllCarModelAccordingSearchController = async (req, res) => {
  const {searchText}= req.query;
  try {
    const carTypesData = await getAllCarModelAccordingSearchFromDB(searchText);
    return res
      .status(200)
      .json({ status: "success", data: carTypesData, message:"carModel according to search successfully"});
  } catch (error) {
    return res.status(500).json({ status: "error", error });
  }
};
// get a single car data-------------
const getSingleCarController = async (req, res) => {
  const { carId } = req.params;
  try {
    const data = await getSingleCarDataFromDB(carId);
    return res.status(200).json({ status: "success", data });
  } catch (error) {
    return res.status(500).json({ status: "success", error });
  }
};
// get all the car data by a user-------------
const getAllCarsByAUserController = async (req, res) => {
  const { userEmail } = req.query;
  // console.log(req.query);
  // first verify the token data---
  if (userEmail !== req?.user?.userEmail) {
    return res
      .status(403)
      .json({ status: "success", data: null, message: "Forbidden access" });
  }
  try {
    const { allCarsByUser, totalNoOfCars } = await getAllCarsByAUserDataFromDB(
      userEmail
    );
    // console.log(allCarsByUser)
    return res.status(200).json({
      status: "success",
      data: { allCarsByUser, totalNoOfCars },
      message: "User cars access successful",
    });
  } catch (error) {
    return res.status(500).json({ status: "success", error });
  }
};

// get the top six car data---------------
const getTopCarsController = async (req, res) => {
  try {
    const topCars = await getTopCarDataFromDB();
    return res.status(200).json({ status: "success", data: topCars });
  } catch (error) {
    return res.status(500).json({ status: "error", error });
  }
};

// add a car in the database-----------
const addACarController = async (req, res) => {
  const carData = req.body;
  // console.log(carData)
  // first verify the token data---
  if (carData?.addedBy?.email !== req?.user?.userEmail) {
    return res
      .status(403)
      .json({ status: "error", data: null, message: "Forbidden access" });
  }
  try {
    const carDataAdding = await addACarToDB(carData);
    // console.log(carDataAdding);
    return res.status(201).json({ status: "success", data: carDataAdding ,message: "car added successfully"});
  } catch (error) {
    return res.status(500).json({ status: "error", data: error.message });
  }
};
// delete a car from the database-----------
const deleteACarController = async (req, res) => {
  const { carId } = req.params;
  const { userEmail } = req.body;
  // first verify the token data---
  if (userEmail !== req?.user?.userEmail) {
    return res
      .status(403)
      .json({ status: "success", data: null, message: "Forbidden access" });
  }
  try {
    const { deletedData, carDataAfterDelete } = await deleteACarFromDB(
      carId,
      userEmail
    );
    // console.log(carDataAdding)
    return res.status(200).json({
      status: "success",
      data: { deletedData, carDataAfterDelete },
      message: "car deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ status: "error", data: error.message });
  }
};

module.exports = {
  getAllCarsController,
  getAllAvailableCarsController,
  getSingleCarController,
  getTopCarsController,
  getAllCarsTypesController,
  getAllCarModelAccordingSearchController,
  addACarController,
  getAllCarsByAUserController,
  deleteACarController,
};
