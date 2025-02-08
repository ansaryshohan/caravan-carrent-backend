const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const {
  getUserImgController,
  createUserImgController,
} = require("./userImg.controller");

const uploadFolder = path.join(__dirname, "../../public/images");

// Ensure the folder exists
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// multer upload image setting
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    const filename = file.originalname.split(" ").join("-");
    cb(null, Date.now() + "-" + filename);
  },
});

const upload = multer({
  storage,
  // fileFilter: function (req, file, cb) {
  //   if (file) {
  //     console.log("from file filter", file);
  //   } else {
  //     console.log("from file filter null", file);
  //   }
  // },
});

router.get("/user-image", getUserImgController);
router.post("/user-image", upload.single("photo"), createUserImgController);

module.exports = router;
