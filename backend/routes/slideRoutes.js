import express from "express";
import { authMiddleware } from "../middlewares/authmiddleware.js";
import { upload } from "../middlewares/upload.js";
import {
  deleteSlide,
  fetchSlideById,
  fetchSlidesForClass,
  uploadSlide,
} from "../controllers/slideController.js";

const router = express.Router();

router.post(
  "/upload/:classId",
  authMiddleware,
  upload.single("slide"),
  uploadSlide,
);
router.delete("/delete/:slideId", authMiddleware, deleteSlide);
router.get("/allSlides/:classId", authMiddleware, fetchSlidesForClass);
router.get("/fetchSlideById/:slideId", authMiddleware, fetchSlideById);

export default router;
