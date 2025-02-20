const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token = req?.cookies?.token;
  if (!token) {
    res.status(401).json({status: "error", data:null, message: "unauthorized access" });
  }
  jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      res.status(403).json({status: "error", data:null, message: "forbidden access" });
    }
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
