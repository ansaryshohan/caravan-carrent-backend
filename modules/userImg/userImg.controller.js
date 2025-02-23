const userImgModel = require("./userImg.model");
const { getUserImgFromDB, createUserImgInDB,createUserImgDataInDB } = require("./userImg.service");

const createUserImgDataController= async (req, res) => {
  const userData = req.body;
  
  try {
    const userImgObj = await createUserImgDataInDB(userData);

    // console.log("getUserImgController", userImgObj);

    return res.status(201).json({ status: "success", data: userImgObj, message:"user data inserted successfully" });
  } catch (error) {
    return res.status(500).json({ status: "error", data: error.message , message:"an error occurred"});
  }
};

// not using just made it in case 
const createUserImgController = async (req, res) => {
  const { userEmail } = req.body;

  // console.log(req.file ,userEmail);

  const userImgInfo = {
    userEmail,
    userImg: "images/" + req.file.filename,
  };
  
  try {
    const userImgObj = await createUserImgInDB(userImgInfo);

    // console.log("getUserImgController", userImgObj);

    return res.status(200).json({ status: "success", data: userImgObj });
  } catch (error) {
    return res.status(500).json({ status: "error", data: error.message });
  }
};

// not using just made it in case
const getUserImgController = async (req, res) => {
  const { email } = req.query;
  // console.log(email);
  const userImgObj = await getUserImgFromDB(email);

  console.log("getUserImgController", userImgObj);

  return res.status(200).json({ status: "success", data: userImgObj });
};

module.exports = { getUserImgController, createUserImgController,createUserImgDataController };
