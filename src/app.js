// -------------------------------Episode 06 : Connected to Database and connnection first and then the server conncetion -----------------------
//Src -> config -> database.js //here write the code for connection to database
//Using mongoose libarary -> for creating schema & modal of user
//Command for installaion mongoose (npm i mongoose)

const express = require("express");
//Require DB connection config File
const { connectDB } = require("./config/database");
//Require Modla of user schema
const User = require("./models/user");
//Helper function for validating User data (Signup form)
const { validatorForSignUp } = require("./utils/validation");
//for bcrypt password of user--> npm i bcrypt
const bcrypt = require("bcrypt");
//Cookie parse for the reading of cookies
const cookieParse = require("cookie-parser");
//JSON web Token for authentication of user
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/userAuth");

//For api routes-->express
const app = express();

//Middleware for data read in json
app.use(express.json());
//Middleware for reading the cookies
app.use(cookieParse());

//requiring multiples of routes from the files
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

//use that routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

//Making connection to the Database
connectDB()
  .then(() => {
    console.log("Database Connected successfully");
    //after connection to DataBase then run the server commands
    app.listen(3000, () => {
      console.log("Server is successfully Listening to Port:3000");
    });
  })
  .catch((err) => {
    console.log("DB connection failed");
  });

// -------------------------That apis are without the userAuth(without protected)--------------------
//get a user by email
// app.get("/user", async (req, res) => {
//   const userEmail = req.body.email;

//   try {
//     //logic for find a user
//     const findUser = await User.find({ email: userEmail });
//     if (findUser.length === 0) {
//       res.status(404).send("User not found");
//     } else {
//       res.send(findUser);
//     }
//   } catch (error) {
//     // console.log("Not added:", error.message);
//     res.status(400).send("ERROR : " + error.message);
//   }
// });

// //get all users for feed
// app.get("/feed", async (req, res) => {
//   try {
//     const allUsers = await User.find({});
//     res.send(allUsers);
//   } catch (error) {
//     // console.log("Not added:", error.message);
//     res.status(400).send("ERROR : " + error.message);
//   }
// });

// //Delete a user form Database
// app.delete("/user", async (req, res) => {
//   const userEmail = req.body.email;

//   // console.log(userEmail);

//   try {
//     const deletedUser = await User.findOneAndDelete({ email: userEmail });
//     if (!deletedUser) {
//       res.status(404).send("User Not found");
//     } else {
//       console.log("user  is deleted........");
//       res.send(deletedUser);
//     }
//   } catch (error) {
//     // console.log("Not added:", error.message);
//     res.status(400).send("ERROR : " + error.message);
//   }
// });

// //Patch a user form Database
// app.patch("/user/:useremail", async (req, res) => {
//   const userEmail = req.params?.useremail;
//   const data = req.body;

//   // console.log(userEmail);

//   try {
//     //validation for update the user data
//     const ALLOWED_UPDATE = ["photoUrl", "gender", "age", "skills"];
//     const isUpdateAllowed = Object.keys(data).every((k) =>
//       ALLOWED_UPDATE.includes(k)
//     );
//     if (!isUpdateAllowed) {
//       throw new Error("Update not Allowed");
//     }
//     //if the skill length is greater then 10 skills error throw
//     if (data?.skills.length > 10) {
//       throw new Error("Skills cannot be more then 10");
//     }
//     const patchUser = await User.findOneAndUpdate({ email: userEmail }, data, {
//       returnDocument: "after",
//       //gender update validator
//       runValidators: true,
//     });
//     if (!patchUser) {
//       res.status(404).send("User Not found");
//     } else {
//       console.log("user is Updated........");
//       res.send(patchUser);
//     }
//   } catch (error) {
//     // console.log("Not added:", error.message);
//     res.status(400).send("ERROR : " + error.message);
//   }
// });
