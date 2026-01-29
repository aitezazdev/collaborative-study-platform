import express from "express";
import { 
  createClass, 
  deleteClass, 
  fetchClassBySlug, 
  fetchClassStudents, 
  fetchUserClasses, 
  joinClass, 
  updateClass, 
  fixClassSlugs 
} from "../controllers/classController.js";
import { firebaseAuth } from "../middlewares/firebaseAuth.js";

const router = express.Router();

router.post("/create", firebaseAuth, createClass);
router.post("/join", firebaseAuth, joinClass);
router.get("/my-classes", firebaseAuth, fetchUserClasses);
router.get("/fix-slugs", firebaseAuth, fixClassSlugs);
router.get("/:slug", firebaseAuth, fetchClassBySlug);
router.delete("/:slug", firebaseAuth, deleteClass);
router.get("/:slug/students", firebaseAuth, fetchClassStudents);
router.put("/:slug", firebaseAuth, updateClass);

export default router;