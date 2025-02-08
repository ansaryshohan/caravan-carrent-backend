const mongoose = require("mongoose");
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.evsael1.mongodb.net/caravan-carRental?retryWrites=true&w=majority&appName=Cluster0`;
// console.log(uri)

async function dbConnect() {
  try {
    await mongoose.connect(uri);
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.log(error);
  }
}

module.exports = dbConnect;
