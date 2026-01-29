import express from "express";
import { getUserProfile, updateProfile } from "../controllers/userProfile.js";
import { upload } from "../middlewares/upload.js";
import { firebaseAuth } from "../middlewares/firebaseAuth.js";

const router = express.Router();

router.get("/info", firebaseAuth, getUserProfile);
router.put("/update", firebaseAuth, upload.single("avatar"), updateProfile);

export default router;
