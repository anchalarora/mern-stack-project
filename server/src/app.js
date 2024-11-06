// app.js
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");

const app = express();
const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    allowedHeaders: "Content-Type",
    credentials: true,
  })
);

app.use(express.json());
app.use("/api", userRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the registration API!");
});

module.exports = app;
