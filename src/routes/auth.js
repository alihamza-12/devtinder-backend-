const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validatorForSignUp } = require("../utils/validation");

const authRouter = express.Router();

//SignUp api(Route)
authRouter.post("/signup", async (req, res) => {
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
authRouter.post("/login", async (req, res) => {
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
//post logout api
authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout Successfully");
});

module.exports = authRouter;
