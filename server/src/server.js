require("dotenv").config();
const connectDB = require("./config/db");

console.log("PORT:", process.env.PORT);
console.log("MONGO_URI:", process.env.MONGO_URI);
connectDB();

const PORT = process.env.PORT;

const app = require("./app");

app.listen(PORT, () => {
  console.log(`SERVER is running at port http://localhost:${PORT}`);
});
