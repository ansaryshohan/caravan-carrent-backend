const { Schema, model } = require("mongoose");

const userImgSchema = new Schema({
  userEmail: {
    type: String,
    required: true,
    unique: true,
  },
  userImg: {
    type: String,
    required: true,
  },
});

const userImgModel = model("userImage", userImgSchema);

module.exports = userImgModel;
