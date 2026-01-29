import express from "express";
import { upload } from "../middlewares/upload.js";
import {
  deleteSlide,
  fetchSlideById,
  fetchSlidesForClass,
  uploadSlide,
} from "../controllers/slideController.js";
import { firebaseAuth } from "../middlewares/firebaseAuth.js";

const router = express.Router();

router.post(
  "/upload/:classId",
  firebaseAuth,
  upload.single("slide"),
  uploadSlide,
);
router.delete("/delete/:slideId", firebaseAuth, deleteSlide);
router.get("/allSlides/:classId", firebaseAuth, fetchSlidesForClass);
router.get("/fetchSlideById/:slideId", firebaseAuth, fetchSlideById);

export default router;
