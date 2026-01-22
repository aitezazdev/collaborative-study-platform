import express from "express";
import authRouter from "./routes/authRoutes";
const app = express();

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.use("/api/auth", authRouter);