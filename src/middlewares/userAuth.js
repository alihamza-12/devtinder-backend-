const jwt = require("jsonwebtoken");
const user = require("../models/user");

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  try {
    if (!token) {
      throw new Error("Invalid Token..");
    }
    //Decoding Token
    const decoded = await jwt.verify(token, "SecrureKeyIsHere");
    const { _id } = decoded;
    //Find user form the DB using _id
    const findUser = await user.findById({ _id });
    if (!findUser) {
      throw new Error("User not Found");
    }
    //For sending back the data of user to the api from middleware
    req.findUser = findUser;
    next();
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
};
//-----------------------------------That userAuth is used for the practice.js file ------------------
// const userAuth = (req, res, next) => {
//   //Logic for validating the token of admin
//   const token = "xyz";
//   const isAuth = token === "xyz";
//   console.log("User Authentication is checked");
//   if (!isAuth) {
//     res.status(401).send("UnAuthenticated Request");
//   } else {
//     next();
//   }
// };

module.exports = {
  userAuth,
};
