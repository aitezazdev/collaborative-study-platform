import { Class } from "../models/classModel.js";
import { Slide } from "../models/slideModel.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// upload silde
export const uploadSlide = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { title } = req.body;
    const { classId } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!classId) {
      return res
        .status(400)
        .json({ success: false, message: "Class ID is required" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Slide file is required" });
    }

    const foundClass = await Class.findById(classId);

    if (!foundClass) {
      return res
        .status(404)
        .json({ success: false, message: "Class not found" });
    }

    if (foundClass.teacher.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the class teacher can upload slides",
      });
    }

    const fileExtension = req.file.originalname.split(".").pop().toLowerCase();
    const allowedExtensions = ["pdf", "ppt", "pptx", "doc", "docx"];

    if (!allowedExtensions.includes(fileExtension)) {
      return res.status(400).json({
        success: false,
        message: "Only PDF, PowerPoint or Word files are allowed",
      });
    }

    const fileSizeInMB = req.file.size / (1024 * 1024);
    if (fileSizeInMB > 100) {
      return res.status(400).json({
        success: false,
        message: "File size must be less than 100MB",
      });
    }

    const uploadFromBuffer = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: `class_slides/${classId}`,
            resource_type: "raw",
            timeout: 120000,
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          },
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const result = await uploadFromBuffer();

    const newSlide = await Slide.create({
      title: title || "",
      fileName: req.file.originalname,
      url: result.secure_url,
      public_id: result.public_id,
      class: classId,
      uploadedBy: userId,
    });

    res.status(201).json({
      success: true,
      message: "Slide uploaded successfully",
      slide: newSlide,
    });
  } catch (error) {
    console.error("Upload Error:", error);

    if (error.name === "TimeoutError") {
      return res.status(408).json({
        success: false,
        message:
          "Upload timeout. Please try with a smaller file or check your connection.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// delete slide
export const deleteSlide = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { slideId } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const slide = await Slide.findById(slideId);

    if (!slide) {
      return res
        .status(404)
        .json({ success: false, message: "Slide not found" });
    }

    const foundClass = await Class.findById(slide.class);

    if (foundClass.teacher.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the class teacher can delete slides",
      });
    }

    const cloudinaryResult = await cloudinary.uploader.destroy(
      slide.public_id,
      { resource_type: "raw" },
    );

    if (cloudinaryResult.result !== "ok") {
      return res.status(500).json({
        success: false,
        message: "Failed to delete file from Cloudinary",
      });
    }

    await Slide.findByIdAndDelete(slideId);

    res
      .status(200)
      .json({ success: true, message: "Slide deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// fetch slides for a class
export const fetchSlidesForClass = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { classId } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const slides = await Slide.find({ class: classId })
      .populate({
        path: "class",
        select: "title teacher",
        populate: {
          path: "teacher",
          select: "name email",
        },
      })
      .populate({
        path: "uploadedBy",
        select: "name email",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      slides,
    });
  } catch (error) {
    console.error("Fetch Slides Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
