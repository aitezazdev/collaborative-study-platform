import { Class } from "../models/classModel.js";
import { Slide } from "../models/slideModel.js";
import { User } from "../models/user.js"; 
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import path from "path";
import fs from "fs";
import os from "os";
import { spawn } from "child_process";

const convertDocxToPdf = async (buffer, originalName) => {
  const tempDir = os.tmpdir();
  const inputPath = path.join(tempDir, originalName);
  const outputPath = path.join(
    tempDir,
    originalName.replace(/\.[^/.]+$/, ".pdf"),
  );

  fs.writeFileSync(inputPath, buffer);

  const isWindows = os.platform() === "win32";
  const sofficePath = isWindows
    ? "C:\\Program Files\\LibreOffice\\program\\soffice.exe"
    : "soffice";

  await new Promise((resolve, reject) => {
    const proc = spawn(sofficePath, [
      "--headless",
      "--convert-to",
      "pdf",
      "--outdir",
      tempDir,
      inputPath,
    ]);

    proc.on("error", reject);
    proc.on("exit", (code) => {
      if (code !== 0) return reject(new Error("LibreOffice conversion failed"));
      resolve();
    });
  });

  const pdfBuffer = fs.readFileSync(outputPath);

  fs.unlinkSync(inputPath);
  fs.unlinkSync(outputPath);

  return pdfBuffer;
};

export const uploadSlide = async (req, res) => {
  try {
    const firebaseUid = req.user?.uid;
    const { title } = req.body;
    const { classId } = req.params;

    if (!firebaseUid)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found in database" 
      });
    }
    const userId = user._id;

    if (!classId)
      return res
        .status(400)
        .json({ success: false, message: "Class ID is required" });

    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "Slide file is required" });

    const foundClass = await Class.findById(classId).populate('teacher');
    if (!foundClass)
      return res
        .status(404)
        .json({ success: false, message: "Class not found" });

    const teacherUid = foundClass.teacher?.Uid || foundClass.teacher?.uid || foundClass.teacher?.firebaseUid;
    const teacherId = foundClass.teacher?._id?.toString();
    
    console.log('Authorization Check:', {
      firebaseUid,
      userId: userId?.toString(),
      teacherUid,
      teacherId,
      teacherObject: foundClass.teacher
    });

    const isAuthorized = teacherUid === firebaseUid || teacherId === userId?.toString();
    
    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "Only the class teacher can upload slides",
      });
    }

    const fileExtension = req.file.originalname.split(".").pop().toLowerCase();
    const allowedExtensions = ["pdf", "ppt", "pptx", "doc", "docx"];
    if (!allowedExtensions.includes(fileExtension))
      return res.status(400).json({
        success: false,
        message: "Only PDF, PowerPoint or Word files are allowed",
      });

    const fileSizeInMB = req.file.size / (1024 * 1024);
    if (fileSizeInMB > 100)
      return res.status(400).json({
        success: false,
        message: "File size must be less than 100MB",
      });

    let fileBuffer = req.file.buffer;
    let finalFileName = req.file.originalname;

    if (fileExtension !== "pdf") {
      try {
        console.log(`Converting ${fileExtension} to PDF...`);
        fileBuffer = await convertDocxToPdf(fileBuffer, req.file.originalname);
        finalFileName = req.file.originalname.replace(
          new RegExp(`.${fileExtension}$`),
          ".pdf",
        );
        console.log("Conversion successful!");
      } catch (conversionError) {
        console.error("Conversion Error:", conversionError);
        return res.status(500).json({
          success: false,
          message:
            "Failed to convert file to PDF. Please try again or upload a PDF directly.",
          error: conversionError.message,
        });
      }
    }

    const uploadFromBuffer = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: `class_slides/${classId}`,
            resource_type: "raw",
            format: "pdf",
            access_mode: "public",
            timeout: 120000,
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          },
        );

        streamifier.createReadStream(fileBuffer).pipe(stream);
      });

    const result = await uploadFromBuffer();

    const newSlide = await Slide.create({
      title: title || path.parse(req.file.originalname).name,
      fileName: finalFileName,
      originalFileName: req.file.originalname,
      url: result.secure_url,
      public_id: result.public_id,
      fileType: fileExtension,
      convertedToPdf: fileExtension !== "pdf",
      class: classId,
      uploadedBy: userId, 
    });

    res.status(201).json({
      success: true,
      message:
        fileExtension !== "pdf"
          ? "File converted to PDF and uploaded successfully"
          : "Slide uploaded successfully",
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

export const deleteSlide = async (req, res) => {
  try {
    const firebaseUid = req.user?.uid;
    const { slideId } = req.params;

    if (!firebaseUid) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found in database" 
      });
    }
    const userId = user._id;

    const slide = await Slide.findById(slideId);
    if (!slide) {
      return res
        .status(404)
        .json({ success: false, message: "Slide not found" });
    }

    const foundClass = await Class.findById(slide.class).populate('teacher');
    if (!foundClass) {
      return res
        .status(404)
        .json({ success: false, message: "Class not found" });
    }

    const teacherUid = foundClass.teacher?.Uid || foundClass.teacher?.uid || foundClass.teacher?.firebaseUid;
    const teacherId = foundClass.teacher?._id?.toString();
    
    console.log('Delete Authorization Check:', {
      firebaseUid,
      userId: userId?.toString(),
      teacherUid,
      teacherId,
      teacherObject: foundClass.teacher
    });

    const isAuthorized = teacherUid === firebaseUid || teacherId === userId;
    
    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "Only the class teacher can delete slides",
      });
    }

    if (slide.public_id) {
      let deletionSuccess = false;

      try {
        let cloudinaryResult = await cloudinary.uploader.destroy(
          slide.public_id,
          { resource_type: "raw", invalidate: true },
        );

        if (cloudinaryResult.result === "ok") {
          deletionSuccess = true;
        }

        if (!deletionSuccess && cloudinaryResult.result === "not found") {
          const publicIdWithoutExt = slide.public_id.replace(
            /\.(pdf|ppt|pptx|doc|docx)$/i,
            "",
          );

          cloudinaryResult = await cloudinary.uploader.destroy(
            publicIdWithoutExt,
            { resource_type: "raw", invalidate: true },
          );

          if (cloudinaryResult.result === "ok") {
            deletionSuccess = true;
          }
        }

        if (!deletionSuccess) {
          const publicIdWithoutExt = slide.public_id.replace(
            /\.(pdf|ppt|pptx|doc|docx)$/i,
            "",
          );

          cloudinaryResult = await cloudinary.uploader.destroy(
            publicIdWithoutExt,
            { resource_type: "image", invalidate: true },
          );

          if (cloudinaryResult.result === "ok") {
            deletionSuccess = true;
          }
        }

        if (!deletionSuccess) {
          const publicIdWithoutExt = slide.public_id.replace(
            /\.(pdf|ppt|pptx|doc|docx)$/i,
            "",
          );

          cloudinaryResult = await cloudinary.uploader.destroy(
            publicIdWithoutExt,
            { resource_type: "video", invalidate: true },
          );

          if (cloudinaryResult.result === "ok") {
            deletionSuccess = true;
          }
        }

        if (!deletionSuccess) {
          return res.status(500).json({
            success: false,
            message: "Failed to delete file from cloud storage",
          });
        }
      } catch (cloudinaryError) {
        return res.status(500).json({
          success: false,
          message: "Error deleting file from cloud storage",
          error: cloudinaryError.message,
        });
      }
    }

    await Slide.findByIdAndDelete(slideId);

    return res.status(200).json({
      success: true,
      message: "Slide deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// fetch slides for a class
export const fetchSlidesForClass = async (req, res) => {
  try {
    const firebaseUid = req.user?.uid;
    const { classId } = req.params;

    if (!firebaseUid) {
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

export const fetchSlideById = async (req, res) => {
  try {
    const { slideId } = req.params;
    const slide = await Slide.findById(slideId);
    if (!slide) {
      return res
        .status(404)
        .json({ success: false, message: "Slide not found" });
    }
    res.status(200).json({ success: true, slide });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};