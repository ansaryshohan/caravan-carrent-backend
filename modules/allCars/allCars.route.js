const express = require("express");
const router = express.Router();
const {
  addACarController,
  getAllCarsController,
  getSingleCarController,
  getAllCarsByAUserController,
  getTopCarsController,
  deleteACarController
} = require("./allCars.controller");

router.get("/all-cars", getAllCarsController);
router.get("/user-cars", getAllCarsByAUserController);
router.get("/top-cars", getTopCarsController);
router.get("/:carId", getSingleCarController);
router.post("/add-car",addACarController);
router.delete("/:carId",deleteACarController);

module.exports = router;
