// controllers/userController.js
const bcrypt = require("bcrypt");
const User = require("../models/User");

const registerUser = async (req, res) => {
  const { firstName, lastName, email, phoneNum, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { phoneNum }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ error: "Email already exists" });
      }
      if (existingUser.phoneNum === phoneNum) {
        return res.status(400).json({ error: "Phone number already exists" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const photos = req.files.map((file) => file.path);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNum,
      profilePictures: photos,
    });

    await newUser.save();

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        firstName,
        lastName,
        email,
        phoneNum,
        photos,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  registerUser,
};
