const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const ConnectionRequestModel = require("../models/connectionRequest");
const user = require("../models/user");

const requestRouter = express.Router();

//Send connection request sended from user to other user
requestRouter.post("/request/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    //recive user from auth current user
    //fromUserId is founded(loggedInUser)
    const findUser = req.findUser;
    const fromUserId = req.findUser._id;
    //status validation
    const allowedStatus = ["interested", "ignored"];
    const isAllowedStatus = allowedStatus.includes(status);
    if (!isAllowedStatus) {
      throw new Error("Status is Invalid...");
    }
    //if the touserId validation(if the toUser not found throw error)
    const toUserData = await user.findById({ _id: toUserId });
    // console.log(toUserData)
    if (!toUserData) {
      throw new Error("Reciver User Not found");
    }
    //also do that validation on schema level using (pre)->before save into the database
    //if the sender is sending request to himself
    // if (fromUserId == toUserId) {
    //   throw new Error("you cannot send request to yourself");
    // }
    //if the user is already sended a request error
    const existConnectionRequest = await ConnectionRequestModel.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (existConnectionRequest) {
      throw new Error("Connection Request already existed");
    }
    const ConnectionRequest = new ConnectionRequestModel({
      fromUserId,
      toUserId,
      status,
    });
    const data = await ConnectionRequest.save();
    res.json({
      message: `${findUser.firstName} is ${status} in  ${toUserData.firstName}`,
      data,
    });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});
module.exports = requestRouter;
