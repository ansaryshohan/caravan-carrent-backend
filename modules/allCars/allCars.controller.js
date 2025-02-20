const AllCarsModel = require("./allCars.model");
const {
  getTopCarDataFromDB,
  getAllCarsDataFromDB,
  getAvailableCarsDataFromDB,
  getSingleCarDataFromDB,
  getAllCarsByAUserDataFromDB,
  addACarToDB,
  deleteACarFromDB
} = require("./allCars.service");

// get all the car data-------------
const getAllCarsController = async (req, res) => {
  const { perPageData, pageNo } = req.query;
  // console.log(req.query,Number(pageNo),Number(perPageData));
  try {
    const {allCars,totalNoOfCars} = await getAllCarsDataFromDB(
      Number(pageNo),
      Number(perPageData)
    );
    return res.status(200).json({ status: "success", data: {allCars,totalNoOfCars} });
  } catch (error) {
    return res.status(500).json({ status: "success", error });
  }
};
// get all available cars data-------------
const getAllAvailableCarsController = async (req, res) => {
  const { perPageData, pageNo } = req.query;
  // console.log(req.query,Number(pageNo),Number(perPageData));
  try {
    const {allCars,totalNoOfCars} = await getAvailableCarsDataFromDB(
      Number(pageNo),
      Number(perPageData)
    );
    return res.status(200).json({ status: "success", data: {allCars,totalNoOfCars} });
  } catch (error) {
    return res.status(500).json({ status: "success", error });
  }
};
// get a single car data-------------
const getSingleCarController = async (req, res) => {
  const { carId} = req.params;
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
  try {
    const { allCarsByUser, totalNoOfCars }= await getAllCarsByAUserDataFromDB(userEmail);
    // console.log(allCarsByUser)
    return res.status(200).json({ status: "success", data: { allCarsByUser, totalNoOfCars } });
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
  try {
    const carDataAdding= await addACarToDB(carData);
    console.log(carDataAdding)
    return res.status(200).json({ status: "success", data:carDataAdding });
  } catch (error) {
    return res.status(500).json({ status: "error", data: error.message });
  }
};
// delete a car from the database-----------
const deleteACarController = async (req, res) => {
  const {carId} = req.params;
  const {userEmail}= req.body;
  try {
    const { deletedData, carDataAfterDelete }= await deleteACarFromDB(carId,userEmail);
    // console.log(carDataAdding)
    return res.status(200).json({ status: "success", data:{ deletedData, carDataAfterDelete } });
  } catch (error) {
    return res.status(500).json({ status: "error", data: error.message });
  }
};

module.exports = {
  getAllCarsController,
  getAllAvailableCarsController,
  getSingleCarController,
  getTopCarsController,
  addACarController,
  getAllCarsByAUserController,
  deleteACarController
};
