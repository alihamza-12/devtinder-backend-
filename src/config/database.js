const mongoose = require("mongoose");

//async function for connected to database

const connectDB = async () => {
  //Compass string for connecting to database
  try {
    await mongoose.connect(
      "mongodb+srv://alihamzaarshad12_db_user:YcTjcyeXhzwhHGeL@practicenode.tyq3jns.mongodb.net/devTinder"
    );
    console.log("Connected to the database successfully");
  } catch (err) {
    console.error("Error connecting to the database", err);
  }
};

module.exports = {
  connectDB,
};
