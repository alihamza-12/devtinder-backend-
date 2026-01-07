const validator = require("validator");

//validating user input data
const validatorForSignUp = (req) => {
  //Getting data of User from the req.body
  const { firstName, lastName, email, password, age } = req.body;

  //Validation of data
  //Name
  if (!firstName || !lastName) {
    throw new Error("Name is Required");
  }
  //Length of Name
  else if (firstName.length > 10 || firstName.length < 3) {
    throw new Error("Fisrt Name length must be 3 to 10 Letters");
  } else if (lastName.length > 10 || lastName.length < 3) {
    throw new Error("Last Name length must be 3 to 10 Letters");
  }
  //emial validation throught validator package
  else if (!email || !validator.isEmail(email)) {
    throw new Error("Email is not Valid");
  } //password validation throught validator package
  else if (!password || !validator.isStrongPassword(password)) {
    throw new Error("Password is not Valid");
  }
  //gender
  else if (!age || age < 18) {
    throw new Error("Age must be greater then 18");
  }
  //Skills Must be 10 only
  //   else if (skills.length !== 10) {
  //     throw new Error("Skills Must be 10 only");
  //   }
};

//patch request helper function
const validateEditProfileData = (req) => {
  const { firstName, lastName, skills, gender, age } = req.body;

  //validation of data
  if (skills.length > 10) {
    throw new Error("Skills cannot be more then 10");
  } else if (!firstName || !lastName) {
    throw new Error("Name is Required");
  }
  //Length of Name
  else if (firstName.length > 10 || firstName.length < 3) {
    throw new Error("Fisrt Name length must be 3 to 10 Letters");
  } else if (lastName.length > 10 || lastName.length < 3) {
    throw new Error("Last Name length must be 3 to 10 Letters");
  }
  //gender
  else if (!age || age < 18) {
    throw new Error("Age must be greater then 18");
  }

  const allowEditFields = [
    "firstName",
    "lastName",
    "photoUrl",
    "gender",
    "skills",
    "age",
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowEditFields.includes(field)
  );
  return isEditAllowed;
};

module.exports = {
  validatorForSignUp,
  validateEditProfileData,
};
