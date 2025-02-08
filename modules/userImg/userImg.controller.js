const userImgModel = require("./userImg.model");
const { getUserImgFromDB, createUserImgInDB } = require("./userImg.service");

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

const getUserImgController = async (req, res) => {
  const { email } = req.query;
  console.log(email);
  const userImgObj = await getUserImgFromDB(email);

  console.log("getUserImgController", userImgObj);

  return res.status(200).json({ status: "success", data: userImgObj });
};

module.exports = { getUserImgController, createUserImgController };
