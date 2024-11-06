// routes/userRoutes.js
const express = require("express");
const { registerUser } = require("../controllers/userController");
const upload = require("../middleware/multerConfig");

const router = express.Router();

router.post("/register", upload.array("photos", 10), registerUser);

module.exports = router;
