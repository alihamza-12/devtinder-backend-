const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
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
//Feed api
userRoute.get("/feed", userAuth, async (req, res) => {
  //Pagination
  const page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  limit = limit > 50 ? 50 : limit;
  const skip = (page - 1) * limit;
  //   console.log(page, limit);

  //conditions
  //-user cannot see his own card
  //-his connection card
  //-his ignored peoples
  //-his sent request peoples
  try {
    //1-logged In User
    const loggedInUser = req.findUser;
    //2-Find all the connections of the loggedInuser(his card,his friends,he sended requested )
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");
    //3-Hide that users which is friend,already sended request and user loggedIN himself
    const hideUsersFromFeed = new Set();
    //4-loop on the users to put in array with only unique values
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });
    // res.send([...hideUsersFromFeed]);
    //5-find the users which are not in the hideUsersFeed --> that is the users for feed
    const usersForFeed = await User.find({
      $and: [
        { _id: { $nin: [...hideUsersFromFeed] } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select("-password -updatedAt -createdAt")
      //Pagination
      .limit(limit)
      .skip(skip);
    res.json({
      message: `Data fetched successfully`,
      count: usersForFeed.length,
      data: usersForFeed,
    });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});
module.exports = userRoute;
