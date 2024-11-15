// middleware/authMiddleware.js
//to protect certain routes using the JWT token:

require("dotenv").config();
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ error: "Access denied" });
  }
  console.log("decoded", authHeader);
  try {
    console.log("jwt verification started");
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("jwt verification ended");
    req.userId = decoded.userId;

    console.log("decoded", decoded.userId);

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid tokennnn" });
  }
};

module.exports = authMiddleware;
