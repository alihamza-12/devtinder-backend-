const express = require("express");
const { userAuth } = require("../middlewares/userAuth");

const profileRoute = express.Router();

//post profile
profileRoute.get("/profile/view", userAuth, async (req, res) => {
  try {
    //recived from the middleware(userAuth.js)
    const findUser = req.findUser;
    res.send(findUser);
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});
module.exports = profileRoute;
