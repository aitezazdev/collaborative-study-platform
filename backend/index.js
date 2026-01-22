const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/dbconnect");

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
