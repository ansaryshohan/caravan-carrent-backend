const userImgModel = require("./userImg.model");
const fs = require("fs");
const path = require("path");

const createUserImgInDB = async (userImgData) => {
  try {
    const findUser = await userImgModel.findOne({
      userEmail: userImgData.userEmail,
    });
    // if user is not found in DB then create one
    if (!findUser) {
      const userImgObj = new userImgModel(userImgData);
      const userImgObjSave = await userImgObj.save();
      return userImgObjSave;
    }
    // if user is found the update the userImg of the database
    const updateUserImg = await userImgModel.updateOne(
      { userEmail: userImgData.userEmail },
      { userImg: userImgData.userImg }
    );
    // after updating in DB then delete the previous image from the public/image folder
    if (updateUserImg.acknowledged) {
      // delete the previous image from public/images folder
      const filename = findUser.userImg.split("images/")[1];
      const previousImgPath = path.join(
        __dirname,
        "../../public/images",
        filename
      );
      fs.unlink(previousImgPath, (err) => {
        if (err) {
          console.error("Failed to delete file:", err);
          return;
        }
        console.log("File deleted successfully");
      });
      // user image data after it is updated
      const updatedUser = await userImgModel.findOne({
        userEmail: userImgData.userEmail,
      });
      return updatedUser;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const getUserImgFromDB = async (userEmail) => {
  try {
    const userImgObj = await userImgModel.find({ userEmail });

    console.log("form getUserImg service", userImgObj);

    return userImgObj;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getUserImgFromDB, createUserImgInDB };
