const express = require("express");
const verifyToken = require("../../middlewares/verifyToken")
const router = express.Router();
const {
  addACarController,
  getAllCarsController,
  getAllAvailableCarsController,
  getSingleCarController,
  getAllCarsByAUserController,
  getTopCarsController,
  getAllCarsTypesController,
  getAllCarModelAccordingSearchController,
  deleteACarController
} = require("./allCars.controller");

// TODO:: only for admin route
router.get("/all-cars", getAllCarsController);
// logged IN users only routes
router.get("/user-cars",verifyToken, getAllCarsByAUserController);
router.post("/add-car", verifyToken,addACarController);
router.delete("/:carId",verifyToken,deleteACarController);
// public routes
router.get("/available-cars", getAllAvailableCarsController);
router.get("/car-types", getAllCarsTypesController);
router.get("/search-cars", getAllCarModelAccordingSearchController);
router.get("/top-cars", getTopCarsController);
router.get("/:carId", getSingleCarController);

module.exports = router;
