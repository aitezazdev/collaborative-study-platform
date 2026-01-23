import express from "express";
import { createClass, joinClass } from "../controllers/classController.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";
const router = express.Router();

router.post("/create", authMiddleware, createClass);
router.post("/join", authMiddleware, joinClass);

export default router;