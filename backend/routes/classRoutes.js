import express from "express";
import { createClass, deleteClass, fetchClassStudents, fetchUserClasses, joinClass, updateClass } from "../controllers/classController.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";
const router = express.Router();

router.post("/create", authMiddleware, createClass);
router.post("/join", authMiddleware, joinClass);
router.get("/my-classes", authMiddleware, fetchUserClasses);
router.delete("/delete/:id", authMiddleware, deleteClass);
router.get("/all-students/:id", authMiddleware, fetchClassStudents);
router.put("/update/:id", authMiddleware, updateClass);

export default router;