import { login, registerUser } from "../controllers/auth";

import express from "express";
import { authMiddleware } from "../middlewares/authmiddleware";
const router = express.Router();

//LOGIN ROUTE
router.post("/register",authMiddleware, registerUser);
router.post("/login", authMiddleware, login);

export default router;