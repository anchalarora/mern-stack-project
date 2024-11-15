// controllers/userController.js
require("dotenv").config();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET;

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

let refreshTokens = [];

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

const registerUser = async (req, res) => {
  const { firstName, lastName, email, phoneNum, password } = req.body;
  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

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

    console.log(
      "####",
      firstName,
      lastName,
      email,
      phoneNum,
      photos,
      password,
      hashedPassword
    );

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

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  console.log("##########loginUser");

  try {
    const user = await User.findOne({ email });

    console.log("##########loginUSer", user);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid  credentials" });
    }

    console.log("##########loginUSer", isMatch);
    // const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
    //   expiresIn: "1h",
    // });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    console.log("##########loginUSer", accessToken, refreshToken);

    console.log("tokens", accessToken, refreshToken);

    refreshTokens.push(refreshToken);

    res
      .status(200)
      .json({ message: "Login successful", accessToken, refreshToken });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Errorrrrrr" });
  }
};

const refreshToken = (req, res) => {
  console.log("##########refresh");
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({ error: "Refresh token is required" });
  }

  console.log("Current refresh tokens:", refreshTokens);
  if (!refreshTokens.includes(token)) {
    return res.status(403).json({ error: "Invalid refresh token" });
  }

  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    const newAccessToken = generateAccessToken(decoded.userId);
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired refresh token" });
  }
};

// Protected route controller (optional)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    //res.json(user);
    res.status(200).json({ message: "Profile data", user: user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const logoutUser = (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter((t) => t !== token);
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  refreshToken,
  logoutUser,
};
