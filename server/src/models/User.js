const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String, // Hashed password
  phoneNum: { type: String, unique: true },
  profilePictures: [String], // Store file paths
});

module.exports = mongoose.model("User", userSchema);
