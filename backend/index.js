import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/dbconnect.js";
import app from "./app.js";

dotenv.config();

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
