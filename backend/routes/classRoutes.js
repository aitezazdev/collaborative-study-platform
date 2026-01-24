import express from "express";
import { createClass, fetchUserClasses, joinClass } from "../controllers/classController.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";
const router = express.Router();

router.post("/create", authMiddleware, createClass);
router.post("/join", authMiddleware, joinClass);
router.get("/my-classes", authMiddleware, fetchUserClasses);

export default router;