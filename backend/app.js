import express from "express";
import authRouter from "./routes/authRoutes.js";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.use("/api/auth", authRouter);

export default app;
