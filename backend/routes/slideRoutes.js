import express from "express";
import { authMiddleware } from "../middlewares/authmiddleware.js";
import { upload } from "../middlewares/upload.js";
import { uploadSlide } from "../controllers/slideController.js";

const router = express.Router();

router.post("/upload", authMiddleware, upload.single("slide"), uploadSlide);

export default router;
