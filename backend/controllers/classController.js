import { Class } from "../models/classModel.js";
import crypto from "crypto";
import { Slide } from "../models/slideModel.js";

// create class
export const createClass = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });
    }

    let joinCode = crypto.randomBytes(4).toString("hex");
    const existingClass = await Class.findOne({ joinCode });
    if (existingClass) {
      joinCode = crypto.randomBytes(4).toString("hex");
    }

    const newClass = await Class.create({
      title,
      description: description || "",
      teacher: req.user._id,
      joinCode,
    });

    const populatedClass = await Class.findById(newClass._id)
      .populate("teacher", "name email avatar")
      .populate("students", "name email avatar");

    res.status(201).json({
      success: true,
      message: "Class created successfully",
      class: populatedClass,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// join class
export const joinClass = async (req, res) => {
  try {
    const { joinCode } = req.body;

    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!joinCode) {
      return res.status(400).json({ message: "Join code is required" });
    }

    const foundClass = await Class.findOne({ joinCode });

    if (!foundClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    if (foundClass.teacher.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Teacher already in class" });
    }

    if (foundClass.students.includes(req.user._id)) {
      return res
        .status(400)
        .json({ success: false, message: "Already joined" });
    }

    foundClass.students.push(req.user._id);
    await foundClass.save();

    const populatedClass = await Class.findById(foundClass._id)
      .populate("teacher", "name email avatar")
      .populate("students", "name email avatar");

    res.json({
      success: true,
      message: "Joined class successfully",
      class: populatedClass,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

//fetch user classes
export const fetchUserClasses = async (req, res) => {
  const userId = req.user?._id;
  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const classes = await Class.find({
      $or: [{ teacher: userId }, { students: userId }],
    })
      .populate("teacher", "name email avatar")
      .populate("students", "name email avatar");
    return res.status(200).json({
      success: true,
      message: "Classes fetched successfully",
      data: classes,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// delete class
export const deleteClass = async (req, res) => {
  try {
    const classId = req.params.id;

    if (!req.user?._id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const foundClass = await Class.findById(classId);

    if (!foundClass) {
      return res
        .status(404)
        .json({ success: false, message: "Class not found" });
    }

    if (foundClass.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the teacher can delete the class",
      });
    }

    const slides = await Slide.find({ class: classId });

    if (slides.length > 0) {
      for (const slide of slides) {
        try {
          await cloudinary.uploader.destroy(slide.public_id, {
            resource_type: "raw",
          });
        } catch (cloudinaryError) {
          console.error(
            `Failed to delete slide ${slide.public_id} from Cloudinary:`,
            cloudinaryError,
          );
        }
      }
    }

    await Slide.deleteMany({ class: classId });

    await Class.findByIdAndDelete(classId);

    res.json({
      success: true,
      message: "Class and all associated data deleted successfully",
    });
  } catch (error) {
    console.error("Delete Class Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// fetch all class students
export const fetchClassStudents = async (req, res) => {
  try {
    const classId = req.params.id;

    if (!req.user?._id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const foundClass = await Class.findById(classId).populate(
      "students",
      "name email avatar",
    );

    if (!foundClass) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }

    res.json({
      success: true,
      message: "Class students fetched successfully",
      students: foundClass.students,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
}
