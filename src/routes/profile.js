const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const { validateEditProfileData } = require("../utils/validation");

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
//Edit the user profile
profileRoute.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    //helper Function
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Data for Edit");
    }
    //recived from the middleware(userAuth.js)
    const loggedInUser = req.findUser;
    //updating the data of loggedinuser
    // loggedInUser.firstName=req.body.firstName
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    //save the loggedinuser to database
    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName} , your profile is Updated`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});
module.exports = profileRoute;
