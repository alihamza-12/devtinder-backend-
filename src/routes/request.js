const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const ConnectionRequestModel = require("../models/connectionRequest");
const user = require("../models/user");

const requestRouter = express.Router();

//Send connection request sended from user(LoggedInUser) to other user
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

//reviewing the requests and accept the request which status is interested
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      //2-get the status and the requestId from the url
      const { status, requestId } = req.params;
      //1-LoggedInUser recived from the userAuth
      const loggedInUser = req.findUser;
      //3-check the status of the request only accepted and ingnored
      const allowedStatus = ["accepted", "rejected"];
      const isStatusAllowed = allowedStatus.includes(status);
      if (!isStatusAllowed) {
        throw new Error("Status for that request is Invalid");
      }
      //4-Getting the request of that user form DB
      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      //5-If the request not found then throw error
      if (!connectionRequest) {
        throw new Error("Connection Request not Found");
      }
      //6-else update the status to accepted or rejected
      connectionRequest.status = status;
      //7-Save to DB
      const data = await connectionRequest.save();
      //8-send back the res with that data
      res.json({
        message: `Connection Request is ${status}`,
        data,
      });
    } catch (error) {
      res.status(400).send("ERROR : " + error.message);
    }
  }
);
module.exports = requestRouter;
