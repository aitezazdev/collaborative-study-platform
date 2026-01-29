import express from "express";
import { createClass, deleteClass, fetchClassStudents, fetchUserClasses, joinClass, updateClass } from "../controllers/classController.js";
import { firebaseAuth } from "../middlewares/firebaseAuth.js";
const router = express.Router();

router.post("/create", firebaseAuth, createClass);
router.post("/join", firebaseAuth, joinClass);
router.get("/my-classes", firebaseAuth, fetchUserClasses);
router.delete("/delete/:id", firebaseAuth, deleteClass);
router.get("/all-students/:id", firebaseAuth, fetchClassStudents);
router.put("/update/:id", firebaseAuth, updateClass);

export default router;