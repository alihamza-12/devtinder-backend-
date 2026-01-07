//Creating schema for the user model
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 10,
    },
    lastName: {
      type: String,
      required: false,
      minLength: 3,
      maxLength: 10,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not Valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not Strong");
        }
      },
    },
    gender: {
      type: String,
      //validating the user by checking that it is (male,female or others) gender
      //this will only work while the user creation phase
      //enum: ["male", "female", "others"],
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is invalid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://img.freepik.com/premium-vector/user-icon-icon_1076610-59410.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("URL is not Valid");
        }
      },
    },
    skills: {
      type: [String],
      maxlength: 10,
    },
    age: {
      type: Number,
      required: true,
      validate(value) {
        if (value <= 18) {
          throw new Error("Age is not greater then 18");
        }
      },
    },
  },
  //time of creation user
  {
    timestamps: true,
  }
);
//Schema level methodes--->which is helper function we called

//helper simple  function for user password and the hashed password comparizan
UserSchema.methods.isPassValid = async function (userInputPassword) {
  const findUser = this;
  const hashedPass = findUser.password;
  const isPaasswordValid = await bcrypt.compare(userInputPassword, hashedPass);
  return isPaasswordValid;
};
//helper simple  function for jwt
//Module schema method for jwt
UserSchema.methods.getjwt = async function () {
  const findUser = this;
  const token = await jwt.sign({ _id: findUser._id }, "SecrureKeyIsHere", {
    expiresIn: "1d",
  });
  return token;
};
module.exports = mongoose.model("User", UserSchema);
