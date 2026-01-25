import express from "express";
import { authMiddleware } from "../middlewares/authmiddleware.js";
import { getUserProfile, updateProfile } from "../controllers/userProfile.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.get("/info", authMiddleware, getUserProfile);
router.post("/update", authMiddleware, upload.single("image"), updateProfile);

export default router;
