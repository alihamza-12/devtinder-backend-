const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const ConnectionRequestModel = require("../models/connectionRequest");
const userRoute = express.Router();

const SAFED_USER_DATA = "firstName lastName photoUrl gender age skills";
//Get all the pending requests for the loggedInUser
userRoute.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    //1-loggedInUser from the UserAuth
    const loggedInUser = req.findUser;
    //2-see in the DB that if the connection (Requests found then show that request)-->interested
    const connectionRequest = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
      //need the data of the formUser(which sends the request like name etc which data is required)
      //for that use (ref:user-->user collection reference in the schema of connectionRequest)
    }).populate("fromUserId", SAFED_USER_DATA);
    //if the connectionrequest not found then run that condition
    if (connectionRequest.length == 0) {
      throw new Error("Requests Not Found");
    }
    res.json({
      message: `Data fetched successfully`,
      data: connectionRequest,
    });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});
//Get all the friends(connections of the loggedInUser)
userRoute.get("/user/connections", userAuth, async (req, res) => {
  try {
    //1-loggedInUser from the UserAuth
    const loggedInUser = req.findUser;
    //2-see in the DB that if the connection (Requests found then show that request)-->interested
    const connectionRequest = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
      //3-need the data of the formUser(which sends the request like name etc which data is required)
      //for that use (ref:user-->user collection reference in the schema of connectionRequest)
    })
      .populate("fromUserId", SAFED_USER_DATA)
      .populate("toUserId", SAFED_USER_DATA);
    //4-if the connectionrequest not found then run that condition
    if (connectionRequest.length == 0) {
      throw new Error("You have 0 frinds");
    }
    //5-only send back the data of the friends not the loggedInUser
    const finalDataOfFriends = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({
      message: `Data fetched successfully`,
      data: finalDataOfFriends,
    });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});
module.exports = userRoute;
