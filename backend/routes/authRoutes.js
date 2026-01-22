import { login } from "../controllers/auth";

import express from "express";
const router = express.Router();

//LOGIN ROUTE
router.post("/login", login);

export default router;