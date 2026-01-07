const express = require("express");
const { userAuth } = require("../middlewares/userAuth");

const requestRouter = express.Router();


//Send connection request sended from user to other user
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    //recive user from auth current user
    const findUser = req.findUser;
    res.send(findUser.firstName + " Sended a connection request ");
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});
module.exports = requestRouter;
