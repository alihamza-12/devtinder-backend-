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

app.post("/signup", async (req, res) => {
  const data = req.body;
  const { firstName, lastName, email, password, gender, skills, age } =
    req.body;

  //manually data send

  // const user = new User({
  //   firstName: "Don",
  //   lastName: "Jhon",
  //   email: "hello3@gmail.com",
  // });

  try {
    //Validation of User Data
    validatorForSignUp(req);

    //Password encryption(hash Password)
    const hashedPass = await bcrypt.hash(password, 10);
    // console.log("Hashed Password of user:", hashedPass);

    //if the skill length is greater then 10 skills error throw
    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be more then 10");
    }
    
    //Create new instance of the user model
    //Dynamically send data
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPass,
      gender,
      skills,
      age,
    });

    //Saving user to database
    await user.save();

    res.send("User is Added");

    console.log("user is added to the Database");
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});
//post login for user
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const findUser = await User.findOne({ email: email });

    if (findUser) {
      const userPassword = findUser.password;
      //Compare plain password with the hash Password which are stored in the database
      // const isPaasswordValid = await bcrypt.compare(password, userPassword);

      //From the user schema there we compare the password in the helper function
      const isPaasswordValid = await findUser.isPassValid(password);
      if (isPaasswordValid) {
        //  const token = await jwt.sign(
        //   { _id: findUser._id },
        //   "SecrureKeyIsHere",
        //   { expiresIn: "1d" }
        // );

        //user.js(getting that jwt from the scheme.methods file of user)
        const token = await findUser.getjwt();
        // console.log(token);
        //sending jwt token in cookies
        res.cookie("token", token);

        res.send("User Login successfully");
      } else {
        throw new Error("Invalid caridentials");
      }
    } else {
      throw new Error("Invalid caridentials");
    }
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});
//post profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    //recived from the middleware(userAuth.js)
    const findUser = req.findUser;
    res.send(findUser);
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});
//Send connection request sended from user to other user
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    //recive user from auth current user
    const findUser = req.findUser;
    res.send(findUser.firstName + " Sended a connection request ");
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});
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
