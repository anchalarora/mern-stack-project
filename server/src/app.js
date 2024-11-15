const express = require("express");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");

const app = express();

const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: "Content-Type",
    credentials: true,
  })
);

app.options("*", cors());

app.use(express.json());
app.use("/api", userRoutes);

app.get("/", (req, res) => {
  res.send("welcome to the registration API");
});

app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;
