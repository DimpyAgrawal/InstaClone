const jwt = require("jsonwebtoken");
const { jwt_secret } = require('../Keys');
const mongoose = require("mongoose");
const USER = mongoose.model('USER');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "You must be logged in" });
  }
  
  // Trim any leading/trailing spaces and "Bearer" from the token
  const token = authorization.split(' ')[1];
  console.log(token);

  jwt.verify(token, jwt_secret, (err, payload) => {
  if (err) {
    console.error("JWT verification error:", err);
    return res.status(401).json({ error: "Authentication failed" });
  } 

    const { _id } = payload;
    //console.log(_id);
    USER.findById(_id) 
      .then(userData => {
        if (!userData) {
          return res.status(401).json({ error: "User not found" });
        }
        
        req.user = userData;
        next();
      })
      .catch(error => {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal server error" });
      });
  });
};
