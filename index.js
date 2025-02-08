const express = require("express");
const cors = require("cors");
const path = require("path");
const dbConnect = require("./dataBase/dbConnect");
const userImgRouter = require("./modules/userImg/userImg.route");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" folder
app.use("/images", express.static(path.join(__dirname, "public/images")));

// connect to database
dbConnect();

// routes
app.use("/caravan", userImgRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
