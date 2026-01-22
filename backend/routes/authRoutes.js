import { login, registerUser } from "../controllers/auth.js";

import express from "express";
const router = express.Router();

// auth route
router.post("/register", registerUser);
router.post("/login", login);

export default router;