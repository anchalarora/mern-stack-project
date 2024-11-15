// routes/userRoutes.js
const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  refreshToken,
} = require("../controllers/userController");
const upload = require("../middleware/multerConfig");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", upload.array("photos", 10), registerUser);

router.post("/login", loginUser);

router.get("/profile", authMiddleware, getUserProfile);

router.post("/refresh-token", refreshToken);

module.exports = router;
